import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule, AsyncPipe } from '@angular/common';
import { HeaderComponent } from './shared/components/header/header';
import { FooterComponent } from './shared/components/footer/footer';
import { GlobalLoadingComponent } from './shared/components/global-loading/global-loading';
import { NotificationsComponent } from './shared/components/notifications/notifications';
import { GlobalLoadingService } from './core/services/global-loading.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    GlobalLoadingComponent,
    NotificationsComponent,
    CommonModule,
    AsyncPipe,
  ],
  template: `
    @if ((globalLoadingService.globalLoading$ | async) === false) {
      <app-header></app-header>
      <main
        class="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20 bg-gradient-to-br from-blue-50 to-blue-200 min-h-screen"
      >
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
    }

    <!-- Loading global (always present, but only shows if active) -->
    <app-global-loading></app-global-loading>

    <!-- Notifications (always present, but only shows when there are notifications) -->
    <app-notifications></app-notifications>
  `,
  styles: [],
})
export class App {
  protected readonly title = signal('fly-cheap');
  protected readonly globalLoadingService = inject(GlobalLoadingService);
}
