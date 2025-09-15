import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';

import { SearchBarComponent } from '../components/search-bar/search-bar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink,
    SearchBarComponent,
  ],
  template: `
    <!-- Hero Section -->
    <section class="relative pb-16 bg-gradient-to-br from-blue-50 to-blue-200 flex items-center">
      <div class="container mx-auto px-6 text-center">
        <div class="max-w-4xl mx-auto">
          <p class="text-xl md:text-2xl text-blue-600 mb-12 font-medium">
            Découvrez les vols les moins chers du monde entier
          </p>

          <!-- Search Card -->
          <!-- <mat-card
            class="max-w-4xl mx-auto p-8 shadow-2xl rounded-3xl bg-white/90 backdrop-blur-sm"
          >
            <h2 class="text-2xl font-bold text-blue-700 mb-6">Rechercher votre vol idéal</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <mat-form-field appearance="fill" class="w-full">
                <mat-label>Départ</mat-label>
                <input matInput placeholder="Paris (CDG)" />
                <mat-icon matSuffix>flight_takeoff</mat-icon>
              </mat-form-field>
              <mat-form-field appearance="fill" class="w-full">
                <mat-label>Arrivée</mat-label>
                <input matInput placeholder="New York (JFK)" />
                <mat-icon matSuffix>flight_land</mat-icon>
              </mat-form-field>
              <mat-form-field appearance="fill" class="w-full">
                <mat-label>Départ</mat-label>
                <input matInput type="date" />
                <mat-icon matSuffix>calendar_today</mat-icon>
              </mat-form-field>
              <mat-form-field appearance="fill" class="w-full">
                <mat-label>Retour</mat-label>
                <input matInput type="date" />
                <mat-icon matSuffix>calendar_today</mat-icon>
              </mat-form-field>
            </div>
            <button mat-raised-button color="primary" class="w-full md:w-auto text-lg px-8 py-3">
              <mat-icon class="mr-2">search</mat-icon>
              Rechercher les vols
            </button>
          </mat-card> -->
          <app-search-bar (searchFlights)="onSearchFlights($event)"></app-search-bar>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-6">
        <h2 class="text-4xl font-bold text-center text-blue-800 mb-16">
          Pourquoi choisir FlyCheap ?
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <mat-card class="p-8 text-center items-center hover:shadow-xl transition-shadow">
            <div class="flex gap-4">
              <mat-icon class="text-blue-600 text-2xl">attach_money</mat-icon>
              <h3 class="text-xl font-bold text-blue-800 mb-4">Prix imbattables</h3>
            </div>
            <p class="text-gray-600">
              Trouvez les vols les moins chers grâce à notre comparateur intelligent
            </p>
          </mat-card>
          <mat-card class="p-8 text-center items-center hover:shadow-xl transition-shadow">
            <div class="flex gap-4">
              <mat-icon class="text-blue-600">public</mat-icon>
              <h3 class="text-xl font-bold text-blue-800 mb-4">Destinations mondiales</h3>
            </div>
            <p class="text-gray-600">
              Plus de 1000 destinations dans le monde entier à votre portée
            </p>
          </mat-card>
          <mat-card class="p-8 text-center items-center hover:shadow-xl transition-shadow">
            <div class="flex gap-4">
              <mat-icon class="text-blue-600">verified_user</mat-icon>
              <h3 class="text-xl font-bold text-blue-800 mb-4">Réservation sécurisée</h3>
            </div>
            <p class="text-gray-600">Paiement 100% sécurisé et assistance 24h/24</p>
          </mat-card>
        </div>
      </div>
    </section>

    <!-- Popular Destinations -->
    <section class="py-16 bg-gradient-to-r from-blue-50 to-blue-100">
      <div class="container mx-auto px-6">
        <h2 class="text-4xl font-bold text-center text-blue-800 mb-16">Destinations populaires</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <mat-card class="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
            <div
              class="h-48 bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center"
            >
              <div class="text-center text-white">
                <mat-icon class="text-4xl mb-2">location_city</mat-icon>
                <h3 class="text-xl font-bold">Paris</h3>
              </div>
            </div>
            <div class="p-6">
              <p class="text-gray-600 mb-4">La ville lumière vous attend</p>
              <p class="text-2xl font-bold text-blue-600">À partir de 89€</p>
            </div>
          </mat-card>
          <mat-card class="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
            <div
              class="h-48 bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center"
            >
              <div class="text-center text-white">
                <mat-icon class="text-4xl mb-2">nature_people</mat-icon>
                <h3 class="text-xl font-bold">Tokyo</h3>
              </div>
            </div>
            <div class="p-6">
              <p class="text-gray-600 mb-4">Découvrez la culture japonaise</p>
              <p class="text-2xl font-bold text-blue-600">À partir de 450€</p>
            </div>
          </mat-card>
          <mat-card class="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
            <div
              class="h-48 bg-gradient-to-r from-orange-400 to-red-600 flex items-center justify-center"
            >
              <div class="text-center text-white">
                <mat-icon class="text-4xl mb-2">wb_sunny</mat-icon>
                <h3 class="text-xl font-bold">New York</h3>
              </div>
            </div>
            <div class="p-6">
              <p class="text-gray-600 mb-4">La ville qui ne dort jamais</p>
              <p class="text-2xl font-bold text-blue-600">À partir de 320€</p>
            </div>
          </mat-card>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-blue-600 text-white">
      <div class="container mx-auto px-6 text-center">
        <h2 class="text-4xl font-bold mb-6">Prêt à partir à l'aventure ?</h2>
        <p class="text-xl mb-8 opacity-90">
          Rejoignez des milliers de voyageurs qui ont fait confiance à FlyCheap
        </p>
        <div class="space-x-4">
          <button mat-raised-button color="accent" class="px-8 py-3" routerLink="/auth/register">
            S'inscrire gratuitement
          </button>
          <button
            mat-stroked-button
            style="border-color: white !important; color: white;"
            class="px-8 py-3"
            routerLink="/flights"
          >
            Voir tous les vols
          </button>
        </div>
      </div>
    </section>
  `,
  styles: '',
})
export class HomeComponent {
  // Cette méthode sera déclenchée quand le SearchBar émettra ses données
  onSearchFlights(searchData: {
    departure: string;
    destination: string;
    departureDate: string;
    returnDate: string;
  }) {
    console.log('[Home] recherche reçue :', searchData);
    // Ici on pourra appeler l’API pour chercher les vols
  }
}
