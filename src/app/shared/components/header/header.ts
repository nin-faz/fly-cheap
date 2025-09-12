// import { RouterLink } from '@angular/router';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  template: `
    <header
      class="relative flex items-center justify-between px-16 py-5 bg-blue-200 text-white shadow-md overflow-visible"
    >
      <div class="flex items-center gap-3">
        <img
          src="assets/logo-fly.png"
          alt="Logo"
          class="h-22 w-32 rounded-full cursor-pointer drop-shadow-xl absolute -ml-6 z-20"
          onclick="onLogoClick()"
        />
      </div>
      <!-- <nav class="flex gap-6 text-base font-medium ml-10">
        <ul class="flex space-x-8">
          <li>
            <a
              routerLink="/home"
              routerLinkActive="text-blue-900"
              class="hover:text-blue-900 text-blue-800 transition"
              >Accueil</a
            >
          </li>
          <li>
            <a
              routerLink="#"
              routerLinkActive="text-blue-900"
              class="hover:text-blue-900 text-blue-800 transition"
              >Réservations</a
            >
          </li>
          <li>
            <a
              routerLink="#"
              routerLinkActive="text-blue-900"
              class="hover:text-blue-900 text-blue-800 transition"
              >Vols</a
            >
          </li>
          <li>
            <a
              routerLink="#"
              routerLinkActive="text-blue-900"
              class="hover:text-blue-900 text-blue-800 transition"
              >Mon compte</a
            >
          </li>
        </ul>
      </nav> -->

      <!-- Actions -->
      <div class="flex items-center gap-6">
        <button mat-raised-button color="accent">Connexion</button>
        <button mat-raised-button color="accent">Inscription</button>
      </div>
    </header>
  `,
  styles: '',
})
export class HeaderComponent {
  onLogoClick() {
    // Action à définir, exemple : navigation ou console log
    console.log('Logo cliqué !');
  }
}
