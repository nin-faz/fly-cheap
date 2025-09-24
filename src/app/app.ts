import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule, AsyncPipe } from '@angular/common';
import { HeaderComponent } from './shared/components/header/header';
import { FooterComponent } from './shared/components/footer/footer';
import { GlobalLoadingComponent } from './shared/components/global-loading/global-loading';
import { GlobalLoadingService } from './core/services/global-loading.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    GlobalLoadingComponent,
    CommonModule,
    AsyncPipe,
  ],
  template: `
    @if ((globalLoadingService.globalLoading$ | async) === false) {
      <app-header></app-header>
      <main class="container mx-auto py-20 bg-gradient-to-br from-blue-50 to-blue-200">
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
    }

    <!-- Loading global (always present, but only shows if active) -->
    <app-global-loading></app-global-loading>
  `,
  styles: [],
})
export class App {
  protected readonly title = signal('fly-cheap');
  protected readonly globalLoadingService = inject(GlobalLoadingService);
}
