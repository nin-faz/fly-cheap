import { Injectable, signal, computed, inject } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs/operators';
import { NotificationService } from './notification';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

@Injectable({
  providedIn: 'root',
})
export class PwaService {
  // Signals for PWA state
  private deferredPrompt = signal<BeforeInstallPromptEvent | null>(null);
  private isInstalled = signal<boolean>(false);
  private isOnline = signal<boolean>(navigator.onLine);
  private updateAvailable = signal<boolean>(false);

  // Computed for installation state
  canInstall = computed(() => !!this.deferredPrompt() && !this.isInstalled());

  // Public readonly state
  readonly installPrompt = this.deferredPrompt.asReadonly();
  readonly installed = this.isInstalled.asReadonly();
  readonly online = this.isOnline.asReadonly();
  readonly hasUpdate = this.updateAvailable.asReadonly();

  private readonly swUpdate = inject(SwUpdate);
  private readonly notificationService = inject(NotificationService);

  constructor() {
    this.initializePwa();
    this.setupNetworkListener();
    this.setupUpdateListener();
  }

  /**
   * Initialise PWA events
   */
  private initializePwa(): void {
    // Detection of installation event
    window.addEventListener('beforeinstallprompt', (event: Event) => {
      console.warn('[PWA] Installation prompt available');
      event.preventDefault();
      this.deferredPrompt.set(event as BeforeInstallPromptEvent);
    });

    // Detection if app is already installed
    window.addEventListener('appinstalled', () => {
      console.warn('[PWA] App installed successfully');
      this.isInstalled.set(true);
      this.deferredPrompt.set(null);
      this.notificationService.showSuccess('Application installée avec succès !');
    });

    // Check initial if app is in standalone mode
    this.checkIfInstalled();
  }

  /**
   * Check if app is in standalone mode (installed)
   */
  private checkIfInstalled(): void {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    // iOS Safari exposes 'standalone' on Navigator, but it's not in the standard type
    const nav = window.navigator as Navigator & { standalone?: boolean };
    const isInWebAppiOS = nav.standalone === true;

    if (isStandalone || isInWebAppiOS) {
      this.isInstalled.set(true);
      console.warn('[PWA] App is running in standalone mode');
    }
  }

  /**
   * Configure network status listener
   */
  private setupNetworkListener(): void {
    window.addEventListener('online', () => {
      this.isOnline.set(true);
      console.warn('[PWA] Network: Online');
      this.notificationService.showSuccess('Connexion rétablie');
    });

    window.addEventListener('offline', () => {
      this.isOnline.set(false);
      console.warn('[PWA] Network: Offline');
      this.notificationService.showWarning('Mode hors ligne activé');
    });
  }

  /**
   * Configure service worker update listener
   */
  private setupUpdateListener(): void {
    if (this.swUpdate.isEnabled) {
      // Check for updates
      this.swUpdate.versionUpdates
        .pipe(filter((event): event is VersionReadyEvent => event.type === 'VERSION_READY'))
        .subscribe(() => {
          console.warn('[PWA] New version available');
          this.updateAvailable.set(true);
          this.notificationService.showInfo('Nouvelle version disponible !');
        });

      // Check for updates periodically (every 6 hours)
      setInterval(
        () => {
          this.swUpdate
            .checkForUpdate()
            .then((hasUpdate) => {
              if (hasUpdate) {
                console.warn('[PWA] Update check: New version found');
              }
            })
            .catch((error) => {
              console.error('[PWA] Update check failed:', error);
            });
        },
        6 * 60 * 60 * 1000,
      ); // 6 hours
    }
  }

  /**
   * Propose installation of app
   */
  async installApp(): Promise<boolean> {
    const prompt = this.deferredPrompt();
    if (!prompt) {
      console.warn('[PWA] No install prompt available');
      return false;
    }

    try {
      await prompt.prompt();
      const { outcome } = await prompt.userChoice;

      console.warn(`[PWA] Install prompt result: ${outcome}`);

      if (outcome === 'accepted') {
        this.notificationService.showInfo('Installation en cours...');
        return true;
      } else {
        this.notificationService.showError('Installation annulée');
        return false;
      }
    } catch (error) {
      console.error('[PWA] Install error:', error);
      this.notificationService.showError("Erreur lors de l'installation");
      return false;
    }
  }

  /**
   * Activate the update of service worker
   */
  async activateUpdate(): Promise<void> {
    if (!this.swUpdate.isEnabled || !this.updateAvailable()) {
      return;
    }

    try {
      await this.swUpdate.activateUpdate();
      this.updateAvailable.set(false);
      this.notificationService.showSuccess('Mise à jour appliquée, rechargement...');

      // Reloading after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('[PWA] Update activation failed:', error);
      this.notificationService.showError('Erreur lors de la mise à jour');
    }
  }

  /**
   * Share content via Web Share API
   */
  async shareContent(data: { title?: string; text?: string; url?: string }): Promise<boolean> {
    if (!navigator.share) {
      console.warn('[PWA] Web Share API not supported');
      return false;
    }

    try {
      await navigator.share(data);
      console.warn('[PWA] Content shared successfully');
      return true;
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('[PWA] Share failed:', error);
        this.notificationService.showError('Erreur lors du partage');
      }
      return false;
    }
  }

  /**
   * Get PWA statistics
   */
  getStats() {
    return {
      isInstalled: this.isInstalled(),
      canInstall: this.canInstall(),
      isOnline: this.isOnline(),
      hasUpdate: this.updateAvailable(),
      swEnabled: this.swUpdate.isEnabled,
      shareSupported: !!navigator.share,
    };
  }
}
