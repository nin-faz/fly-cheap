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
  ],
  template: `
    <div class="max-w-4xl mx-auto p-6">
      @if (flights && flights.length > 0) {
        <div class="grid gap-6">
          @for (flight of flights; track flight.id) {
            <mat-card
              class="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div class="p-6">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <!-- Itinéraire et horaires -->
                  <div class="flex-1">
                    <div class="flex items-center gap-4 mb-3">
                      <div class="text-center">
                        <div class="text-2xl font-bold text-blue-800">
                          {{ flight.departureTime }}
                        </div>
                        <div class="text-lg font-semibold text-gray-700">
                          {{ flight.departure }}
                        </div>
                        <div class="text-sm text-gray-500">{{ flight.departureAirport }}</div>
                      </div>

                      <div class="flex-1 flex items-center justify-center">
                        <div class="flex items-center gap-2 text-gray-400">
                          <div class="h-px bg-gray-300 flex-1"></div>
                          <mat-icon class="text-blue-500">flight_takeoff</mat-icon>
                          <div class="text-sm">{{ flight.duration }}</div>
                          <mat-icon class="text-blue-500">flight_land</mat-icon>
                          <div class="h-px bg-gray-300 flex-1"></div>
                        </div>
                      </div>

                      <div class="text-center">
                        <div class="text-2xl font-bold text-blue-800">{{ flight.arrivalTime }}</div>
                        <div class="text-lg font-semibold text-gray-700">
                          {{ flight.destination }}
                        </div>
                        <div class="text-sm text-gray-500">{{ flight.destinationAirport }}</div>
                      </div>
                    </div>

                    <!-- Détails du vol -->
                    <div class="flex flex-wrap gap-2 mb-2">
                      <mat-chip-set>
                        <mat-chip class="bg-green-100 text-green-800">{{
                          flight.airline
                        }}</mat-chip>
                        <mat-chip class="bg-blue-100 text-blue-800">{{
                          flight.flightNumber
                        }}</mat-chip>
                        @if (flight.stops === 0) {
                          <mat-chip class="bg-emerald-100 text-emerald-800">Vol direct</mat-chip>
                        } @else {
                          <mat-chip class="bg-orange-100 text-orange-800"
                            >{{ flight.stops }} escale(s)</mat-chip
                          >
                        }
                      </mat-chip-set>
                    </div>
                    <div class="text-sm text-gray-600">{{ flight.date }}</div>
                  </div>

                  <!-- Prix et réservation -->
                  <div class="text-center lg:text-right">
                    <div
                      class="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg p-4 mb-3"
                    >
                      <div class="text-sm opacity-90">À partir de</div>
                      <div class="text-3xl font-bold">{{ flight.price }}€</div>
                      <div class="text-sm opacity-90">par personne</div>
                    </div>
                    <div class="flex flex-col lg:flex-row gap-2">
                      <button
                        mat-stroked-button
                        color="primary"
                        class="flex-1 lg:flex-none px-6 py-2"
                        [routerLink]="['/flights', flight.id]"
                      >
                        <mat-icon class="mr-2">info</mat-icon>
                        Voir les détails
                      </button>
                      <button
                        mat-raised-button
                        color="primary"
                        class="flex-1 lg:flex-none px-6 py-2"
                        (click)="bookFlight(flight)"
                      >
                        <mat-icon class="mr-2">flight</mat-icon>
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
        <mat-card class="text-center p-12">
          <mat-icon class="text-6xl text-gray-400 mb-4">flight_off</mat-icon>
          <h3 class="text-2xl font-semibold text-gray-600 mb-2">Aucun vol trouvé</h3>
          <p class="text-gray-500">Essayez de modifier vos critères de recherche</p>
        </mat-card>
      }
    </div>
  `,
  styles: [],
})
export class FlightsListComponent {
  @Input() flights: Flight[] = [];

  bookFlight(flight: Flight) {
    // Logique pour réserver le vol
    console.log(`Réservation du vol ${flight.flightNumber}`);
  }
}
