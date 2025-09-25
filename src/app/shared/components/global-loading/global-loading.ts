import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
} from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AsyncPipe } from '@angular/common';
import { GlobalLoadingService } from '../../../core/services/global-loading.service';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-global-loading',
  standalone: true,
  imports: [MatProgressSpinnerModule, AsyncPipe],
  template: `
    @if (globalLoading$ | async) {
      <div class="global-loading-overlay">
        <div class="spinner-container">
          <mat-spinner diameter="60"></mat-spinner>
          <p class="loading-text">Chargement...</p>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .global-loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(2px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
      }

      .spinner-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
      }

      .loading-text {
        color: #1976d2;
        font-size: 1.1rem;
        font-weight: 500;
        margin: 0;
      }
    `,
  ],
})
export class GlobalLoadingComponent implements OnInit, OnDestroy {
  private readonly globalLoadingService = inject(GlobalLoadingService);
  private readonly router = inject(Router);

  globalLoading$: Observable<boolean>;
  private routerSubscription?: Subscription;

  constructor() {
    this.globalLoading$ = this.globalLoadingService.globalLoading$;
  }

  ngOnInit(): void {
    // Auto-detection changements of route
    this.routerSubscription = this.router.events
      .pipe(
        filter(
          (event) =>
            event instanceof NavigationStart ||
            event instanceof NavigationEnd ||
            event instanceof NavigationCancel ||
            event instanceof NavigationError,
        ),
      )
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.globalLoadingService.show();
        } else {
          this.globalLoadingService.hide();
        }
      });
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }
}
