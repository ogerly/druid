import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { db, type Track } from '../db/trackDatabase';
import { TrackingEngine, type TrackingConfig, defaultTrackingConfig } from '../services/trackingEngine';
import { wakeLockManager } from '../utils/wakeLock';

// Erweiterte Interfaces mit Metadaten
interface UserMarker {
  id: number;
  position: [number, number];
  label?: string;
  description?: string;
  timestamp: number;
  category?: string;
}

interface SavedPath {
  id: number;
  points: [number, number][];
  name?: string;
  timestamp: number;
}

export const useMapStore = defineStore('map', () => {
  const center = ref<[number, number]>([51.1657, 10.4515]); // Germany center
  const zoom = ref(6);
  const selectedPoiId = ref<string | null>(null);
  
  // GPS & Recording
  const userLocation = ref<[number, number] | null>(null);
  const isRecording = ref(false);
  const currentPath = ref<[number, number][]>([]);
  const savedPaths = ref<SavedPath[]>([]);
  const userMarkers = ref<UserMarker[]>([]);
  
  // New: Advanced Tracking
  const activeTrack = ref<Track | null>(null);
  const trackingConfig = ref<TrackingConfig>({ ...defaultTrackingConfig });
  const trackingEngine = new TrackingEngine(trackingConfig.value);
  let gpsWatchId: number | null = null;
  
  // Computed: Live statistics
  const liveStats = computed(() => {
    if (!activeTrack.value) {
      return null;
    }
    return db.calculateStats(activeTrack.value);
  });
  
  let nextPathId = 1;
  let nextMarkerId = 1;

  const setCenter = (newCenter: [number, number]) => {
    center.value = newCenter;
  };

  const setZoom = (newZoom: number) => {
    zoom.value = newZoom;
  };

  const selectPoi = (poiId: string, poiCenter: [number, number]) => {
    selectedPoiId.value = poiId;
    center.value = poiCenter;
    zoom.value = 15; // Zoom closer when selecting a POI
  };

  const clearSelection = () => {
    selectedPoiId.value = null;
  };
  
  // GPS Functions
  const centerOnUser = async () => {
    return new Promise<void>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          userLocation.value = [lat, lng];
          center.value = [lat, lng];
          zoom.value = 15;
          resolve();
        },
        () => {
          reject(new Error('Unable to retrieve your location'));
        },
        {
          enableHighAccuracy: true,
          timeout: 15000, // 15 Sekunden für Mobile
          maximumAge: 0
        }
      );
    });
  };
  
  // Recording Functions - LEGACY (kompatibel mit altem Code)
  const toggleRecording = () => {
    if (isRecording.value) {
      // Stop recording and save
      if (currentPath.value.length > 0) {
        savedPaths.value.push({
          id: nextPathId++,
          points: [...currentPath.value],
          timestamp: Date.now()
        });
        currentPath.value = [];
      }
    }
    isRecording.value = !isRecording.value;
  };
  
  // New: Advanced Tracking Functions
  const startTracking = async (trackName: string = 'Unbenannte Wanderung') => {
    try {
      // Create new track in IndexedDB
      activeTrack.value = await db.createTrack(trackName);
      
      // Reset tracking engine
      trackingEngine.reset();
      trackingEngine.updateConfig(trackingConfig.value);
      
      // Request wake lock
      await wakeLockManager.request();
      
      // Start GPS watch
      gpsWatchId = navigator.geolocation.watchPosition(
        async (position) => {
          // Update user location for map
          userLocation.value = [position.coords.latitude, position.coords.longitude];
          
          // Check if waypoint should be saved
          if (trackingEngine.shouldSaveWaypoint(position)) {
            const waypoint = trackingEngine.createWaypoint(position);
            
            // Save to IndexedDB
            if (activeTrack.value) {
              await db.addWaypoint(activeTrack.value.id, waypoint);
              // Update activeTrack to trigger reactivity
              activeTrack.value = await db.tracks.get(activeTrack.value.id) || null;
            }
          }
        },
        (error) => {
          console.error('[GPS] Error:', error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        }
      );
      
      isRecording.value = true;
      console.log('✅ Tracking started:', activeTrack.value.id);
      
    } catch (error: any) {
      console.error('[Tracking] Failed to start:', error.message);
      throw error;
    }
  };
  
  const stopTracking = async () => {
    if (!activeTrack.value) return;
    
    try {
      // Stop GPS watch
      if (gpsWatchId !== null) {
        navigator.geolocation.clearWatch(gpsWatchId);
        gpsWatchId = null;
      }
      
      // Release wake lock
      await wakeLockManager.release();
      
      // Calculate final stats
      const stats = db.calculateStats(activeTrack.value);
      
      // Mark track as completed
      await db.completeTrack(activeTrack.value.id, stats);
      
      console.log('✅ Tracking stopped. Stats:', stats);
      
      // Reset state
      activeTrack.value = null;
      isRecording.value = false;
      trackingEngine.reset();
      
    } catch (error: any) {
      console.error('[Tracking] Failed to stop:', error.message);
    }
  };
  
  const pauseTracking = async () => {
    if (!activeTrack.value) return;
    
    // Stop GPS watch
    if (gpsWatchId !== null) {
      navigator.geolocation.clearWatch(gpsWatchId);
      gpsWatchId = null;
    }
    
    // Release wake lock
    await wakeLockManager.release();
    
    // Mark as paused in DB
    await db.pauseTrack(activeTrack.value.id);
    
    isRecording.value = false;
  };
  
  const resumeTracking = async () => {
    if (!activeTrack.value) return;
    
    // Resume wake lock
    await wakeLockManager.request();
    
    // Resume GPS watch
    gpsWatchId = navigator.geolocation.watchPosition(
      async (position) => {
        userLocation.value = [position.coords.latitude, position.coords.longitude];
        
        if (trackingEngine.shouldSaveWaypoint(position)) {
          const waypoint = trackingEngine.createWaypoint(position);
          
          if (activeTrack.value) {
            await db.addWaypoint(activeTrack.value.id, waypoint);
            activeTrack.value = await db.tracks.get(activeTrack.value.id) || null;
          }
        }
      },
      (error) => console.error('[GPS] Error:', error.message),
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
    
    // Mark as recording in DB
    await db.resumeTrack(activeTrack.value.id);
    
    isRecording.value = true;
  };
  
  const updateTrackingConfig = (config: Partial<TrackingConfig>) => {
    trackingConfig.value = { ...trackingConfig.value, ...config };
    trackingEngine.updateConfig(trackingConfig.value);
  };
  
  const addPointToPath = (point: [number, number]) => {
    if (isRecording.value) {
      currentPath.value.push(point);
    }
  };
  
  const clearPath = () => {
    currentPath.value = [];
    isRecording.value = false;
  };
  
  // Marker Functions - Erweitert mit Metadaten
  const addUserMarker = (
    position: [number, number],
    label?: string,
    description?: string,
    category?: string
  ) => {
    userMarkers.value.push({
      id: nextMarkerId++,
      position,
      label,
      description,
      timestamp: Date.now(),
      category: category || 'personal'
    });
  };
  
  const updateUserMarker = (
    id: number,
    updates: Partial<Omit<UserMarker, 'id' | 'timestamp'>>
  ) => {
    const marker = userMarkers.value.find(m => m.id === id);
    if (marker) {
      Object.assign(marker, updates);
    }
  };
  
  const removeUserMarker = (id: number) => {
    const index = userMarkers.value.findIndex(m => m.id === id);
    if (index !== -1) {
      userMarkers.value.splice(index, 1);
    }
  };

  return {
    center,
    zoom,
    selectedPoiId,
    userLocation,
    isRecording,
    currentPath,
    savedPaths,
    userMarkers,
    // New: Advanced tracking
    activeTrack,
    trackingConfig,
    liveStats,
    setCenter,
    setZoom,
    selectPoi,
    clearSelection,
    centerOnUser,
    toggleRecording, // Legacy
    addPointToPath,
    clearPath,
    addUserMarker,
    updateUserMarker,
    removeUserMarker,
    // New functions
    startTracking,
    stopTracking,
    pauseTracking,
    resumeTracking,
    updateTrackingConfig,
  };
});

export type { UserMarker, SavedPath };
