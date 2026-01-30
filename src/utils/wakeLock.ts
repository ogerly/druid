/**
 * Wake Lock Utility
 * Prevents screen from turning off during GPS tracking
 * 
 * Browser Support:
 * - Chrome/Edge 84+
 * - Safari 16.4+
 * - Firefox: Not supported (use video workaround)
 */

class WakeLockManager {
  private wakeLock: WakeLockSentinel | null = null;
  private isSupported: boolean = false;

  constructor() {
    this.isSupported = 'wakeLock' in navigator;
  }

  /**
   * Request wake lock to keep screen on
   */
  async request(): Promise<boolean> {
    if (!this.isSupported) {
      console.warn('[WakeLock] Wake Lock API not supported');
      return false;
    }

    try {
      this.wakeLock = await navigator.wakeLock.request('screen');
      console.log('✅ Wake Lock aktiviert - Screen bleibt an');

      // Re-acquire wake lock when visibility changes
      this.wakeLock.addEventListener('release', () => {
        console.log('[WakeLock] Released');
      });

      // Handle visibility change (screen lock, tab switch)
      document.addEventListener('visibilitychange', this.handleVisibilityChange);

      return true;
    } catch (err: any) {
      console.error('[WakeLock] Request failed:', err.message);
      return false;
    }
  }

  /**
   * Release wake lock (allow screen to turn off)
   */
  async release(): Promise<void> {
    if (this.wakeLock) {
      try {
        await this.wakeLock.release();
        this.wakeLock = null;
        console.log('🔓 Wake Lock deaktiviert');
        
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
      } catch (err: any) {
        console.error('[WakeLock] Release failed:', err.message);
      }
    }
  }

  /**
   * Check if wake lock is currently active
   */
  get isActive(): boolean {
    return this.wakeLock !== null && !this.wakeLock.released;
  }

  /**
   * Check if Wake Lock API is supported
   */
  get supported(): boolean {
    return this.isSupported;
  }

  /**
   * Handle visibility change to re-acquire wake lock
   */
  private handleVisibilityChange = async () => {
    if (document.visibilityState === 'visible' && this.wakeLock?.released) {
      console.log('[WakeLock] Re-acquiring wake lock after visibility change');
      await this.request();
    }
  };
}

// Singleton instance
export const wakeLockManager = new WakeLockManager();
