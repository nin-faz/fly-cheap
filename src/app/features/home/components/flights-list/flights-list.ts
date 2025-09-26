import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { Flight } from '../../../flights/models/flight';
import { PricePipe } from '../../../../shared/pipes/price.pipe';
import { FlightStops } from '../../../../shared/pipes/flight-stops.pipe';

@Component({
  selector: 'app-flights-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatMenuModule,
    PricePipe,
    FlightStops,
  ],
  template: `
    <div class="max-w-4xl mx-auto p-3 sm:p-6">
      @if (flights && flights.length > 0) {
        <div class="grid gap-4 sm:gap-6">
          @for (flight of flights; track flight.id) {
            <mat-card
              class="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div class="p-4 sm:p-6">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <!-- Route and time -->
                  <div class="flex-1">
                    <div class="flex flex-col sm:flex-row sm:items-center gap-4 mb-3">
                      <div class="text-center flex-shrink-0">
                        <div class="text-lg sm:text-2xl font-bold text-blue-800">
                          {{ flight.departureTime }}
                        </div>
                        <div class="text-base sm:text-lg font-semibold text-gray-700">
                          {{ flight.departure }}
                        </div>
                        <div class="text-xs sm:text-sm text-gray-500">
                          {{ flight.departureAirport }}
                        </div>
                      </div>

                      <div class="flex-1 flex items-center justify-center min-w-0">
                        <div
                          class="flex items-center justify-center gap-1 sm:gap-2 text-gray-400 w-full"
                        >
                          <div class="h-px bg-gray-300 flex-1 hidden sm:block"></div>
                          <mat-icon class="text-blue-500 text-sm sm:text-base"
                            >flight_takeoff</mat-icon
                          >
                          <div class="text-xs sm:text-sm whitespace-nowrap px-1">
                            {{ flight.duration }}
                          </div>
                          <mat-icon class="text-blue-500 text-sm sm:text-base"
                            >flight_land</mat-icon
                          >
                          <div class="h-px bg-gray-300 flex-1 hidden sm:block"></div>
                        </div>
                      </div>

                      <div class="text-center flex-shrink-0">
                        <div class="text-lg sm:text-2xl font-bold text-blue-800">
                          {{ flight.arrivalTime }}
                        </div>
                        <div class="text-base sm:text-lg font-semibold text-gray-700">
                          {{ flight.destination }}
                        </div>
                        <div class="text-xs sm:text-sm text-gray-500">
                          {{ flight.destinationAirport }}
                        </div>
                      </div>
                    </div>

                    <!-- Flight's details -->
                    <div class="flex flex-wrap gap-1 sm:gap-2 mb-2">
                      <mat-chip-set>
                        <mat-chip class="bg-green-100 text-green-800 text-xs sm:text-sm">{{
                          flight.airline
                        }}</mat-chip>
                        <mat-chip class="bg-blue-100 text-blue-800 text-xs sm:text-sm">{{
                          flight.flightNumber
                        }}</mat-chip>
                        <mat-chip class="bg-orange-100 text-orange-800 text-xs sm:text-sm">
                          {{ flight.stops | flightStops }}
                        </mat-chip>
                      </mat-chip-set>
                    </div>
                    <div class="text-xs sm:text-sm text-gray-600">{{ flight.date }}</div>
                  </div>

                  <!-- Prix et réservation -->
                  <div class="text-center lg:text-right w-full lg:w-auto">
                    <div
                      class="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg p-3 sm:p-4 mb-3"
                    >
                      <div class="text-xs sm:text-sm opacity-90">À partir de</div>
                      <div class="text-xl sm:text-3xl font-bold">{{ flight.price | price }}</div>
                      <div class="text-xs sm:text-sm opacity-90">par personne</div>
                    </div>
                    <div class="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-2">
                      <button
                        mat-stroked-button
                        color="primary"
                        class="flex-1 lg:flex-none px-4 sm:px-6 py-2 text-sm sm:text-base"
                        [routerLink]="['/flights', flight.id]"
                      >
                        <mat-icon class="mr-1 sm:mr-2 text-sm sm:text-base">info</mat-icon>
                        <span class="hidden sm:inline">Voir les détails</span>
                        <span class="sm:hidden">Détails</span>
                      </button>
                      <button
                        mat-raised-button
                        color="primary"
                        class="flex-1 lg:flex-none px-4 sm:px-6 py-2 text-sm sm:text-base"
                        [routerLink]="['/booking', flight.id]"
                      >
                        <mat-icon class="mr-1 sm:mr-2 text-sm sm:text-base">flight</mat-icon>
                        Réserver
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </mat-card>
          }
        </div>
      } @else {
        <mat-card class="text-center p-8 sm:p-12">
          <mat-icon class="text-4xl sm:text-6xl text-gray-400 mb-4">flight_off</mat-icon>
          <h3 class="text-xl sm:text-2xl font-semibold text-gray-600 mb-2">Aucun vol trouvé</h3>
          <p class="text-gray-500 text-sm sm:text-base">
            Essayez de modifier vos critères de recherche
          </p>
        </mat-card>
      }
    </div>
  `,
  styles: [],
})
export class FlightsListComponent {
  @Input() flights: Flight[] = [];
}
