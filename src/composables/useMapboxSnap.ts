import { ref } from 'vue';
import type { Track, Waypoint } from '@/db/trackDatabase';

// --- WICHTIG: Mapbox Access Token ---
// Hol dir deinen kostenlosen Token von https://www.mapbox.com/
// und füge ihn in deine .env.local-Datei ein:
// VITE_MAPBOX_ACCESS_TOKEN='DEIN_TOKEN_HIER'
const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

// Typ-Definition für die Antwort der Mapbox Matching API
interface MapboxMatchResponse {
  code: string;
  matchings: {
    confidence: number;
    geometry: {
      coordinates: [number, number][];
      type: string;
    };
    legs: any[];
    weight_name: string;
    weight: number;
    duration: number;
    distance: number;
  }[];
  tracepoints: (object | null)[];
}

export function useMapboxSnap() {
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Sendet einen Track an die Mapbox Matching API, um eine geglättete Route zu erhalten.
   * @param track Der aufzuzeichnende Track
   * @returns Eine neue Polylinie als Array von [lat, lng] Koordinaten oder null bei einem Fehler.
   */
  const snapTrack = async (track: Track): Promise<[number, number][] | null> => {
    if (!MAPBOX_ACCESS_TOKEN) {
      const errorMessage = 'Mapbox Access Token fehlt. Bitte in .env.local setzen.';
      console.error(`❌ ${errorMessage}`);
      error.value = errorMessage;
      alert(errorMessage);
      return null;
    }

    if (track.waypoints.length < 2 || track.waypoints.length > 100) {
        const errorMessage = `Die Anzahl der Wegpunkte muss zwischen 2 und 100 liegen. Dieser Track hat ${track.waypoints.length}.`;
        console.error(`❌ ${errorMessage}`);
        error.value = errorMessage;
        // Fürs Prototyping: Wir schneiden den Track einfach ab
        // alert(errorMessage);
        // return null;
    }

    loading.value = true;
    error.value = null;

    // Mapbox erwartet [lng, lat] Format
    const coordinates = track.waypoints.map(wp => `${wp.lng},${wp.lat}`).join(';');
    const profile = 'mapbox/walking'; // Wichtig für Wanderungen
    const url = `https://api.mapbox.com/matching/v5/${profile}/${coordinates}?geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`;

    try {
      console.log(`🚀 Sende Anfrage an Mapbox Matching API für Track: ${track.name}`);
      const response = await fetch(url);
      const data: MapboxMatchResponse = await response.json();

      if (data.code !== 'Ok' || !data.matchings || data.matchings.length === 0) {
        throw new Error(`Mapbox API Fehler: ${data.code}`);
      }

      console.log(`✅ Erfolgreiche Antwort von Mapbox erhalten. Konfidenz: ${data.matchings[0].confidence.toFixed(2)}`);
      
      // Die Geometrie enthält [lng, lat], wir müssen es für Leaflet in [lat, lng] umwandeln
      const snappedWaypoints: [number, number][] = data.matchings[0].geometry.coordinates.map(
        ([lng, lat]) => [lat, lng]
      );
      
      return snappedWaypoints;

    } catch (e: any) {
      console.error('❌ Fehler bei der Kommunikation mit der Mapbox API:', e);
      error.value = e.message || 'Ein unbekannter Fehler ist aufgetreten.';
      return null;
    } finally {
      loading.value = false;
    }
  };

  return {
    snapTrack,
    loading,
    error,
  };
}
