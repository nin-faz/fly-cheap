import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MyBookingsService } from '../services/my-bookings';
import { Booking } from '../../booking/models/booking';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
  ],
  template: `
    <div class="max-w-5xl mx-auto px-6">
      <!-- Header -->
      <div class="flex items-center gap-4 mb-8">
        <mat-icon class="text-blue-600 text-3xl">flight_takeoff</mat-icon>
        <div>
          <h1 class="text-3xl font-bold text-blue-800">Mes réservations</h1>
          <p class="text-gray-600">Gérez et consultez vos vols réservés</p>
        </div>
      </div>

      <!-- État vide -->
      @if (bookings.length === 0) {
        <mat-card class="text-center p-12 shadow-2xl">
          <h2 class="text-xl font-semibold text-gray-600 mb-2">Aucune réservation trouvée</h2>
          <p class="text-gray-500 mb-6">Vous n'avez pas encore réservé de vol.</p>
          <button mat-raised-button color="primary" routerLink="/">
            <mat-icon class="mr-2">search</mat-icon>
            Rechercher des vols
          </button>
        </mat-card>
      }

      <!-- Liste des réservations -->
      @if (bookings.length > 0) {
        <div class="space-y-8">
          @for (booking of bookings; track booking.id) {
            <mat-card class="mb-8 overflow-hidden shadow-2xl">
              <!-- Header de la réservation -->
              <div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <mat-icon class="text-2xl">flight</mat-icon>
                    <div>
                      <h2 class="text-2xl font-bold">{{ booking.flight.airline }}</h2>
                      <p class="text-blue-200">Vol {{ booking.flight.flightNumber }}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <div
                      [class]="getStatusClass(booking.status)"
                      class="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-2"
                    >
                      {{ getStatusLabel(booking.status) }}
                    </div>
                    <div class="text-sm text-blue-200">Référence: #{{ booking.id }}</div>
                  </div>
                </div>
              </div>

              <!-- Contenu de la réservation -->
              <div class="p-6">
                <!-- Itinéraire principal -->
                <div class="flex items-center justify-between mb-8">
                  <div class="text-center flex-1">
                    <div class="text-3xl font-bold text-blue-800 mb-1">
                      {{ booking.flight.departureTime }}
                    </div>
                    <div class="text-xl font-semibold text-gray-800">
                      {{ booking.flight.departure }}
                    </div>
                    <div class="text-gray-600">{{ booking.flight.departureAirport }}</div>
                    <mat-chip class="mt-2 bg-blue-100 text-blue-800">Départ</mat-chip>
                  </div>

                  <div class="flex-1 flex items-center justify-center px-8">
                    <div class="flex items-center gap-3 text-gray-400">
                      <div class="h-px bg-gray-300 flex-1"></div>
                      <div class="text-center">
                        <mat-icon class="text-blue-500 text-2xl">flight_takeoff</mat-icon>
                        <div class="text-sm font-semibold text-gray-600 mt-1">
                          {{ booking.flight.duration }}
                        </div>
                        <div class="text-xs text-green-600 font-semibold">Vol direct</div>
                      </div>
                      <div class="h-px bg-gray-300 flex-1"></div>
                    </div>
                  </div>

                  <div class="text-center flex-1">
                    <div class="text-3xl font-bold text-blue-800 mb-1">
                      {{ booking.flight.arrivalTime }}
                    </div>
                    <div class="text-xl font-semibold text-gray-800">
                      {{ booking.flight.destination }}
                    </div>
                    <div class="text-gray-600">{{ booking.flight.destinationAirport }}</div>
                    <mat-chip class="mt-2 bg-green-100 text-green-800">Arrivée</mat-chip>
                  </div>
                </div>

                <div class="text-center text-gray-600 mb-6">{{ booking.flight.date }}</div>

                <mat-divider class="mb-6"></mat-divider>

                <!-- Informations détaillées -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <!-- Informations passager -->
                  <mat-card class="p-6 shadow-lg">
                    <div class="flex items-center gap-3 mb-4">
                      <mat-icon class="text-blue-600 text-2xl">person</mat-icon>
                      <h3 class="text-lg font-semibold text-gray-800">Passager</h3>
                    </div>
                    <div class="space-y-2">
                      <div class="flex justify-between">
                        <span class="text-gray-600">Nom:</span>
                        <span class="font-semibold">{{ booking.passenger.name }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600">Prénom:</span>
                        <span class="font-semibold">{{ booking.passenger.surname }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600">Type:</span>
                        <span class="font-semibold">{{ booking.passenger.type }}</span>
                      </div>
                    </div>
                  </mat-card>

                  <!-- Informations de réservation -->
                  <mat-card class="p-6 shadow-lg">
                    <div class="flex items-center gap-3 mb-4">
                      <mat-icon class="text-blue-600 text-2xl">confirmation_number</mat-icon>
                      <h3 class="text-lg font-semibold text-gray-800">Réservation</h3>
                    </div>
                    <div class="space-y-2">
                      <div class="flex justify-between">
                        <span class="text-gray-600">Date de réservation:</span>
                        <span class="font-semibold">{{
                          booking.createdAt | date: 'dd/MM/yyyy'
                        }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600">Statut:</span>
                        <div
                          [class]="getStatusClass(booking.status)"
                          class="inline-block px-2 py-1 rounded text-xs font-semibold"
                        >
                          {{ getStatusLabel(booking.status) }}
                        </div>
                      </div>
                    </div>
                  </mat-card>

                  <!-- Prix total -->
                  <mat-card class="p-6 shadow-lg">
                    <div class="flex items-center gap-3 mb-4">
                      <mat-icon class="text-blue-600 text-2xl">euro</mat-icon>
                      <h3 class="text-lg font-semibold text-gray-800">Tarif</h3>
                    </div>
                    <div class="space-y-2">
                      <div class="flex justify-between">
                        <span class="text-gray-600">Prix du vol:</span>
                        <span class="font-semibold">{{ booking.flight.price }}€</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600">Total:</span>
                        <span class="text-2xl font-bold text-blue-600"
                          >{{ booking.totalPrice }}€</span
                        >
                      </div>
                    </div>
                  </mat-card>
                </div>

                <!-- Options supplémentaires -->
                @if (booking.extras.luggage || booking.extras.extraSeat || booking.extras.meal) {
                  <mat-card class="mt-6 p-6 shadow-lg">
                    <div class="flex items-center gap-3 mb-4">
                      <mat-icon class="text-blue-600 text-xl">add_circle</mat-icon>
                      <h3 class="text-lg font-semibold text-gray-800">Options incluses</h3>
                    </div>
                    <div class="space-y-4">
                      @if (booking.extras.luggage) {
                        <div
                          class="flex items-center justify-between p-4 border rounded-lg bg-blue-50"
                        >
                          <div class="flex items-center gap-3">
                            <mat-icon class="text-blue-600">luggage</mat-icon>
                            <div>
                              <div class="font-semibold">Bagage en soute (23kg)</div>
                              <div class="text-sm text-gray-600">Bagage enregistré inclus</div>
                            </div>
                          </div>
                          <mat-icon class="text-green-600">check_circle</mat-icon>
                        </div>
                      }
                      @if (booking.extras.extraSeat) {
                        <div
                          class="flex items-center justify-between p-4 border rounded-lg bg-blue-50"
                        >
                          <div class="flex items-center gap-3">
                            <mat-icon class="text-blue-600">airline_seat_recline_extra</mat-icon>
                            <div>
                              <div class="font-semibold">Siège avec espace supplémentaire</div>
                              <div class="text-sm text-gray-600">
                                Plus de confort pour vos jambes
                              </div>
                            </div>
                          </div>
                          <mat-icon class="text-green-600">check_circle</mat-icon>
                        </div>
                      }
                      @if (booking.extras.meal) {
                        <div
                          class="flex items-center justify-between p-4 border rounded-lg bg-blue-50"
                        >
                          <div class="flex items-center gap-3">
                            <mat-icon class="text-blue-600">restaurant</mat-icon>
                            <div>
                              <div class="font-semibold">Repas à bord</div>
                              <div class="text-sm text-gray-600">Menu spécialement préparé</div>
                            </div>
                          </div>
                          <mat-icon class="text-green-600">check_circle</mat-icon>
                        </div>
                      }
                    </div>
                  </mat-card>
                }

                <!-- Actions -->
                <div class="flex flex-col md:flex-row gap-4 justify-center mt-8">
                  @if (booking.status === 'confirmed') {
                    <button
                      mat-raised-button
                      class="px-6 py-2"
                      style="border-color: red !important; background-color: red; color: white;"
                      (click)="cancelBooking(booking.id)"
                    >
                      <mat-icon class="mr-2">cancel</mat-icon>
                      Annuler la réservation
                    </button>
                  }
                  @if (booking.status === 'cancelled') {
                    <button
                      mat-raised-button
                      class="px-6 py-2"
                      style="border-color: red !important; background-color: red; color: white;"
                      (click)="deleteBooking(booking.id)"
                    >
                      <mat-icon>delete_forever</mat-icon>
                      Supprimer définitivement
                    </button>
                  }
                </div>
              </div>
            </mat-card>
          }
        </div>
      }
    </div>
  `,
})
export class MyBookingsComponent implements OnInit {
  private readonly myBookingsService = inject(MyBookingsService);
  bookings: Booking[] = [];

  ngOnInit(): void {
    this.loadBookings();
  }

  async loadBookings() {
    this.myBookingsService.getMyBookings().then((bookings) => {
      this.bookings = bookings;
    });
  }

  async cancelBooking(id: string) {
    if (await this.myBookingsService.cancelBooking(id)) {
      this.loadBookings();
    }
  }

  async deleteBooking(id: string) {
    if (await this.myBookingsService.deleteMyBooking(id)) {
      this.loadBookings();
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-500 text-white';
      case 'cancelled':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'confirmed':
        return 'Confirmé';
      case 'cancelled':
        return 'Annulé';
      default:
        return 'Inconnu';
    }
  }
}
