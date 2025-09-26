import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SearchBarComponent } from '../components/search-bar/search-bar';
import { FlightsListComponent } from '../components/flights-list/flights-list';
import { FlightService } from '../../flights/services/flight';
import { Flight } from '../../flights/models/flight';
import { PricePipe } from '../../../shared/pipes/price.pipe';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink,
    SearchBarComponent,
    FlightsListComponent,
    PricePipe,
  ],
  template: `
    <!-- Hero section -->
    <section
      class="relative pb-8 sm:pb-16 bg-gradient-to-br from-blue-50 to-blue-200 flex items-center"
    >
      <div class="container mx-auto px-4 sm:px-6 text-center">
        <div class="max-w-4xl mx-auto">
          <p class="text-lg sm:text-xl md:text-2xl text-blue-600 mb-8 sm:mb-12 font-medium px-4">
            Découvrez les vols les moins chers du monde entier
          </p>

          <!-- Search bar -->
          <app-search-bar (searchFlights)="onSearchFlights($event)"></app-search-bar>

          <!-- Filter and sort -->
          <div class="max-w-4xl mx-auto p-3 sm:p-6">
            <div
              class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 sm:mb-8"
            >
              <div class="flex items-center justify-center lg:justify-start gap-2 sm:gap-3">
                <mat-icon class="text-blue-600 text-2xl sm:text-3xl">flight</mat-icon>
                <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-800">
                  Vols disponibles
                </h2>
              </div>

              <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <div class="relative">
                  <select
                    [ngModel]="sortBy()"
                    (ngModelChange)="onSortChange($event)"
                    class="appearance-none bg-white border border-gray-300 rounded-lg px-3 sm:px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-48"
                  >
                    <option value="price">Prix croissant</option>
                    <option value="price-desc">Prix décroissant</option>
                    <option value="duration">Durée</option>
                    <option value="departure">Heure de départ</option>
                  </select>
                  <mat-icon
                    class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm pointer-events-none"
                    >keyboard_arrow_down</mat-icon
                  >
                </div>

                <div class="relative">
                  <select
                    [ngModel]="filterBy()"
                    (ngModelChange)="onFilterChange($event)"
                    class="appearance-none bg-white border border-gray-300 rounded-lg px-3 sm:px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-48"
                  >
                    <option value="all">Tous les vols</option>
                    <option value="direct">Vols directs</option>
                    <option value="wizz">Wizz Air</option>
                    <option value="easyjet">easyJet</option>
                    <option value="ryanair">Ryanair</option>
                    <option value="transavia">Transavia</option>
                    <option value="aegean">Aegean</option>
                  </select>
                  <mat-icon
                    class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm pointer-events-none"
                    >keyboard_arrow_down</mat-icon
                  >
                </div>

                <button
                  mat-stroked-button
                  color="primary"
                  (click)="resetFiltersAndSort()"
                  class="px-3 sm:px-4 py-2 text-sm"
                >
                  <mat-icon class="mr-1 sm:mr-2 text-sm sm:text-base">refresh</mat-icon>
                  <span class="hidden sm:inline">Réinitialiser</span>
                  <span class="sm:hidden">Reset</span>
                </button>
              </div>
            </div>

            <!-- Search Card -->
            <app-flights-list [flights]="searchResults()"></app-flights-list>
          </div>
        </div>
      </div>
    </section>

    <!-- Features section -->
    <section class="py-12 sm:py-16 bg-white">
      <div class="container mx-auto px-4 sm:px-6">
        <h2
          class="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-blue-800 mb-8 sm:mb-12 lg:mb-16"
        >
          Pourquoi choisir FlyCheap ?
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <mat-card class="p-6 sm:p-8 text-center items-center hover:shadow-xl transition-shadow">
            <div class="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-4">
              <mat-icon class="text-blue-600 text-2xl mb-1.5">attach_money</mat-icon>
              <h3 class="text-lg sm:text-xl font-bold text-blue-800">Prix imbattables</h3>
            </div>
            <p class="text-gray-600 text-sm sm:text-base">
              Trouvez les vols les moins chers grâce à notre comparateur intelligent
            </p>
          </mat-card>
          <mat-card class="p-6 sm:p-8 text-center items-center hover:shadow-xl transition-shadow">
            <div class="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-4">
              <mat-icon class="text-blue-600 text-xl mb-1">public</mat-icon>
              <h3 class="text-lg sm:text-xl font-bold text-blue-800">Destinations mondiales</h3>
            </div>
            <p class="text-gray-600 text-sm sm:text-base">
              Plus de 1000 destinations dans le monde entier à votre portée
            </p>
          </mat-card>
          <mat-card class="p-6 sm:p-8 text-center items-center hover:shadow-xl transition-shadow">
            <div class="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-4">
              <mat-icon class="text-blue-600 text-xl mb-1">verified_user</mat-icon>
              <h3 class="text-lg sm:text-xl font-bold text-blue-800">Réservation sécurisée</h3>
            </div>
            <p class="text-gray-600 text-sm sm:text-base">
              Paiement 100% sécurisé et assistance 24h/24
            </p>
          </mat-card>
        </div>
      </div>
    </section>

    <!-- Popular destinations -->
    <section class="py-12 sm:py-16 bg-gradient-to-r from-blue-50 to-blue-100">
      <div class="container mx-auto px-4 sm:px-6">
        <h2
          class="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-blue-800 mb-8 sm:mb-12 lg:mb-16"
        >
          Destinations populaires
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <mat-card class="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
            <div
              class="h-36 sm:h-48 bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center"
            >
              <div class="text-center text-white">
                <mat-icon class="text-3xl sm:text-4xl mb-2">location_city</mat-icon>
                <h3 class="text-lg sm:text-xl font-bold">Paris</h3>
              </div>
            </div>
            <div class="p-4 sm:p-6">
              <p class="text-gray-600 mb-4 text-sm sm:text-base">La ville lumière vous attend</p>
              <p class="text-xl sm:text-2xl font-bold text-blue-600">
                À partir de {{ destinationPrices.paris | price }}
              </p>
            </div>
          </mat-card>
          <mat-card class="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
            <div
              class="h-36 sm:h-48 bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center"
            >
              <div class="text-center text-white">
                <mat-icon class="text-3xl sm:text-4xl mb-2">nature_people</mat-icon>
                <h3 class="text-lg sm:text-xl font-bold">Tokyo</h3>
              </div>
            </div>
            <div class="p-4 sm:p-6">
              <p class="text-gray-600 mb-4 text-sm sm:text-base">Découvrez la culture japonaise</p>
              <p class="text-xl sm:text-2xl font-bold text-blue-600">
                À partir de {{ destinationPrices.tokyo | price }}
              </p>
            </div>
          </mat-card>
          <mat-card class="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
            <div
              class="h-36 sm:h-48 bg-gradient-to-r from-orange-400 to-red-600 flex items-center justify-center"
            >
              <div class="text-center text-white">
                <mat-icon class="text-3xl sm:text-4xl mb-2">wb_sunny</mat-icon>
                <h3 class="text-lg sm:text-xl font-bold">New York</h3>
              </div>
            </div>
            <div class="p-4 sm:p-6">
              <p class="text-gray-600 mb-4 text-sm sm:text-base">La ville qui ne dort jamais</p>
              <p class="text-xl sm:text-2xl font-bold text-blue-600">
                À partir de {{ destinationPrices.newYork | price }}
              </p>
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
  private readonly flightService = inject(FlightService);

  // Prices for popular destinations
  readonly destinationPrices = {
    paris: 89,
    tokyo: 450,
    newYork: 320,
  };

  // Signals for filters and sorting
  readonly sortBy = signal<string>('price');
  readonly filterBy = signal<string>('all');
  readonly searchCriteria = signal<{
    departure: string;
    destination: string;
    departureDate: string;
    returnDate: string;
  } | null>(null);

  // Signal computed for filtered and sorted results
  readonly searchResults = computed(() => {
    const criteria = this.searchCriteria();
    const filter = this.filterBy();
    const sort = this.sortBy();

    let flights: Flight[];
    if (criteria) {
      flights = this.flightService.searchFlights(criteria);
    } else {
      flights = this.flightService.getFlights();
    }

    const filtered = this.flightService.filterFlights(flights, filter);

    return this.flightService.sortFlights(filtered, sort);
  });

  onSearchFlights(searchData: {
    departure: string;
    destination: string;
    departureDate: string;
    returnDate: string;
  }) {
    this.searchCriteria.set(searchData);
  }

  onFilterChange(filter: string) {
    this.filterBy.set(filter);
  }

  onSortChange(sort: string) {
    this.sortBy.set(sort);
  }

  resetFiltersAndSort() {
    this.sortBy.set('price');
    this.filterBy.set('all');
    this.searchCriteria.set(null);
  }
}
