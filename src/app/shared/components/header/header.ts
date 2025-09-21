import { Router, RouterLink } from '@angular/router';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../features/auth/services/auth';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
  ],
  template: `
    <header
      class="relative flex items-center justify-between px-16 py-5 bg-blue-200 text-white shadow-md overflow-visible"
    >
      <div class="flex items-center gap-3">
        <a routerLink="/" class="block" aria-label="Retour à l'accueil">
          <img
            src="assets/logo-fly.png"
            alt="Logo FlyCheap"
            class="h-22 w-32 rounded-full drop-shadow-xl absolute -ml-6 -mt-16 z-20 cursor-pointer"
          />
        </a>
      </div>

      <div class="flex items-center gap-6">
        <!-- Menus -->
        @if (currentUser()) {
          <button mat-icon-button [matMenuTriggerFor]="userMenu" aria-label="Menu utilisateur">
            <mat-icon>account_circle</mat-icon>
          </button>
          <mat-menu #userMenu="matMenu">
            @if (currentUser()?.role === 'admin') {
              <button mat-menu-item routerLink="/admin">
                <mat-icon>admin_panel_settings</mat-icon>
                <span>Tableau de Bord</span>
              </button>
              <mat-divider></mat-divider>
            }
            <button mat-menu-item routerLink="/my-account">
              <mat-icon>person</mat-icon>
              <span>Mon compte</span>
            </button>
            <button mat-menu-item routerLink="/my-bookings">
              <mat-icon>book_online</mat-icon>
              <span>Mes réservations</span>
            </button>
            <button mat-menu-item (click)="logout()">
              <mat-icon>logout</mat-icon>
              <span>Déconnexion</span>
            </button>
          </mat-menu>
        } @else {
          <button mat-raised-button color="accent" routerLink="/auth/login">Connexion</button>
          <button mat-raised-button color="accent" routerLink="/auth/register">Inscription</button>
        }
      </div>
    </header>
  `,
  styles: '',
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  currentUser = this.authService.currentUser$;

  constructor() {
    // Utiliser directement le signal du service
    this.currentUser = this.authService.currentUser$;
  }

  goToAccount() {
    this.router.navigate(['/account']);
  }

  goToBookings() {
    this.router.navigate(['/bookings']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
