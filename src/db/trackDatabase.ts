import Dexie, { type EntityTable } from 'dexie';

// Waypoint interface
export interface Waypoint {
  id: string;
  lat: number;
  lng: number;
  timestamp: number;
  accuracy: number;
  altitude?: number;
  speed?: number;
}

// Track interface
export interface Track {
  id: string;
  name: string;
  startTime: number;
  endTime?: number;
  waypoints: Waypoint[];
  distance?: number;
  duration?: number;
  status: 'recording' | 'completed' | 'paused';
  createdAt: number;
  updatedAt: number;
}

// Track statistics
export interface TrackStats {
  totalDistance: number;
  duration: number;
  waypointCount: number;
  avgSpeed?: number;
  maxSpeed?: number;
  elevationGain?: number;
}

// Database class
class TrackDatabase extends Dexie {
  tracks!: EntityTable<Track, 'id'>;

  constructor() {
    super('DruidTracksDB');
    
    this.version(1).stores({
      tracks: 'id, startTime, endTime, status, createdAt, updatedAt'
    });
  }

  // Get active (recording) track
  async getActiveTrack(): Promise<Track | undefined> {
    return await this.tracks
      .where('status')
      .equals('recording')
      .first();
  }

  // Get all completed tracks
  async getCompletedTracks(): Promise<Track[]> {
    return await this.tracks
      .where('status')
      .equals('completed')
      .reverse()
      .sortBy('endTime');
  }

  // Create new track
  async createTrack(name: string = 'Unbenannte Wanderung'): Promise<Track> {
    const now = Date.now();
    const track: Track = {
      id: crypto.randomUUID(),
      name,
      startTime: now,
      waypoints: [],
      status: 'recording',
      createdAt: now,
      updatedAt: now
    };
    
    await this.tracks.add(track);
    return track;
  }

  // Add waypoint to track
  async addWaypoint(trackId: string, waypoint: Waypoint): Promise<void> {
    const track = await this.tracks.get(trackId);
    if (!track) {
      throw new Error(`Track ${trackId} not found`);
    }

    track.waypoints.push(waypoint);
    track.updatedAt = Date.now();

    await this.tracks.update(trackId, {
      waypoints: track.waypoints,
      updatedAt: track.updatedAt
    });
  }

  // Complete track
  async completeTrack(trackId: string, stats?: Partial<TrackStats>): Promise<void> {
    const now = Date.now();
    await this.tracks.update(trackId, {
      status: 'completed',
      endTime: now,
      updatedAt: now,
      ...stats
    });
  }

  // Pause track
  async pauseTrack(trackId: string): Promise<void> {
    await this.tracks.update(trackId, {
      status: 'paused',
      updatedAt: Date.now()
    });
  }

  // Resume track
  async resumeTrack(trackId: string): Promise<void> {
    await this.tracks.update(trackId, {
      status: 'recording',
      updatedAt: Date.now()
    });
  }

  // Update track name
  async updateTrackName(trackId: string, name: string): Promise<void> {
    await this.tracks.update(trackId, {
      name,
      updatedAt: Date.now()
    });
  }

  // Delete track
  async deleteTrack(trackId: string): Promise<void> {
    await this.tracks.delete(trackId);
  }

  // Calculate track statistics
  calculateStats(track: Track): TrackStats {
    if (track.waypoints.length === 0) {
      return {
        totalDistance: 0,
        duration: 0,
        waypointCount: 0
      };
    }

    let totalDistance = 0;
    let maxSpeed = 0;

    // Calculate distance between consecutive waypoints
    for (let i = 1; i < track.waypoints.length; i++) {
      const prev = track.waypoints[i - 1];
      const curr = track.waypoints[i];
      
      if (!prev || !curr) continue;
      
      const segmentDistance = this.calculateDistance(
        prev.lat,
        prev.lng,
        curr.lat,
        curr.lng
      );
      
      totalDistance += segmentDistance;

      // Calculate speed for this segment (m/s)
      const timeDiff = (curr.timestamp - prev.timestamp) / 1000; // seconds
      if (timeDiff > 0) {
        const speed = segmentDistance / timeDiff;
        maxSpeed = Math.max(maxSpeed, speed);
      }
    }

    const duration = track.endTime 
      ? track.endTime - track.startTime 
      : Date.now() - track.startTime;

    const avgSpeed = duration > 0 ? totalDistance / (duration / 1000) : 0;

    return {
      totalDistance,
      duration,
      waypointCount: track.waypoints.length,
      avgSpeed,
      maxSpeed
    };
  }

  // Haversine distance formula (returns meters)
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  // Export track as GeoJSON
  exportAsGeoJSON(track: Track): string {
    const geojson = {
      type: 'Feature',
      properties: {
        name: track.name,
        startTime: new Date(track.startTime).toISOString(),
        endTime: track.endTime ? new Date(track.endTime).toISOString() : null,
        ...this.calculateStats(track)
      },
      geometry: {
        type: 'LineString',
        coordinates: track.waypoints.map((wp) => [wp.lng, wp.lat, wp.altitude || 0])
      }
    };

    return JSON.stringify(geojson, null, 2);
  }
}

// Singleton instance
export const db = new TrackDatabase();
