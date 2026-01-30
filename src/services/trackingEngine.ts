import type { Waypoint } from '../db/trackDatabase';

/**
 * Tracking Configuration
 */
export interface TrackingConfig {
  minTimeInterval: number; // Milliseconds (default: 60000 = 1 min)
  minDistance: number;     // Meters (default: 10)
  maxAccuracy: number;     // Meters (default: 50)
}

/**
 * Default configuration
 */
export const defaultTrackingConfig: TrackingConfig = {
  minTimeInterval: 60000, // 1 minute
  minDistance: 10,        // 10 meters
  maxAccuracy: 50         // 50 meters
};

/**
 * Tracking Engine
 * Implements intelligent waypoint filtering based on time, distance, and accuracy
 */
export class TrackingEngine {
  private lastWaypoint: Waypoint | null = null;
  private config: TrackingConfig;

  constructor(config: Partial<TrackingConfig> = {}) {
    this.config = { ...defaultTrackingConfig, ...config };
  }

  /**
   * Update tracking configuration
   */
  updateConfig(config: Partial<TrackingConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): TrackingConfig {
    return { ...this.config };
  }

  /**
   * Reset last waypoint (call when starting new track)
   */
  reset(): void {
    this.lastWaypoint = null;
  }

  /**
   * Check if a new GPS position should be saved as waypoint
   * 
   * Algorithm:
   * 1. Reject if accuracy too poor
   * 2. Accept if first waypoint
   * 3. Reject if minimum time not passed
   * 4. Reject if minimum distance not reached
   * 5. Accept otherwise
   */
  shouldSaveWaypoint(position: GeolocationPosition): boolean {
    const now = Date.now();
    const coords = position.coords;

    // Check 1: Accuracy too poor?
    if (coords.accuracy > this.config.maxAccuracy) {
      console.log(
        `[TrackingEngine] Position rejected: accuracy too poor (${coords.accuracy.toFixed(1)}m > ${this.config.maxAccuracy}m)`
      );
      return false;
    }

    // Check 2: First waypoint?
    if (!this.lastWaypoint) {
      console.log('[TrackingEngine] First waypoint accepted');
      return true;
    }

    // Check 3: Minimum time passed?
    const timeDiff = now - this.lastWaypoint.timestamp;
    if (timeDiff < this.config.minTimeInterval) {
      console.log(
        `[TrackingEngine] Position rejected: minimum time not passed (${(timeDiff / 1000).toFixed(0)}s < ${(this.config.minTimeInterval / 1000).toFixed(0)}s)`
      );
      return false;
    }

    // Check 4: Minimum distance reached?
    const distance = this.calculateDistance(
      this.lastWaypoint.lat,
      this.lastWaypoint.lng,
      coords.latitude,
      coords.longitude
    );

    if (distance < this.config.minDistance) {
      console.log(
        `[TrackingEngine] Position rejected: insufficient movement (${distance.toFixed(1)}m < ${this.config.minDistance}m)`
      );
      return false;
    }

    // Accept waypoint
    console.log(
      `[TrackingEngine] Waypoint accepted: ${distance.toFixed(1)}m moved, ${(timeDiff / 1000).toFixed(0)}s elapsed, accuracy ${coords.accuracy.toFixed(1)}m`
    );
    return true;
  }

  /**
   * Create waypoint from GPS position
   */
  createWaypoint(position: GeolocationPosition): Waypoint {
    const waypoint: Waypoint = {
      id: crypto.randomUUID(),
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      timestamp: Date.now(),
      accuracy: position.coords.accuracy,
      altitude: position.coords.altitude || undefined,
      speed: position.coords.speed || undefined
    };

    this.lastWaypoint = waypoint;
    return waypoint;
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   * Returns distance in meters
   */
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
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

  /**
   * Format distance for display
   */
  formatDistance(meters: number): string {
    if (meters < 1000) {
      return `${meters.toFixed(0)} m`;
    }
    return `${(meters / 1000).toFixed(2)} km`;
  }

  /**
   * Format duration for display
   */
  formatDuration(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      const remainingMinutes = minutes % 60;
      return `${hours}:${remainingMinutes.toString().padStart(2, '0')} h`;
    }

    if (minutes > 0) {
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')} min`;
    }

    return `${seconds} s`;
  }

  /**
   * Format speed for display (m/s to km/h)
   */
  formatSpeed(metersPerSecond: number): string {
    const kmh = metersPerSecond * 3.6;
    return `${kmh.toFixed(1)} km/h`;
  }
}
