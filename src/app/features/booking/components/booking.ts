import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Flight } from '../../flights/models/flight';
import { FlightService } from '../../flights/services/flight';
import { BookingService } from '../services/booking';
import { AuthService } from '../../auth/services/auth';
import { Booking } from '../models/booking';

@Component({
  selector: 'app-flight-booking',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatStepperModule,
    MatChipsModule,
    MatCheckboxModule,
  ],
  template: `
    <div class="max-w-5xl mx-auto px-6">
      <!-- Header -->
      <div class="flex items-center gap-4 mb-8">
        <button mat-icon-button (click)="goBack()" class="text-blue-600">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div>
          <h1 class="text-3xl font-bold text-blue-800">Réserver votre vol</h1>
          <p class="text-gray-600">Complétez votre réservation en quelques étapes</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Formulaire principal -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Récapitulatif du vol -->
          <mat-card class="mb-8 overflow-hidden shadow-2xl">
            <div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <mat-icon class="text-2xl mb-6">flight</mat-icon>
                  <div>
                    <h2 class="text-2xl font-bold">{{ flight?.airline }}</h2>
                    <p class="text-blue-200">Vol {{ flight?.flightNumber }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-3xl font-bold">{{ flight?.price }}€</div>
                  <div class="text-blue-200">par personne</div>
                </div>
              </div>
            </div>

            <div class="p-6">
              <!-- Itinéraire principal -->
              <div class="flex items-center justify-between mb-8">
                <div class="text-center flex-1">
                  <div class="text-3xl font-bold text-blue-800 mb-1">
                    {{ flight?.departureTime }}
                  </div>
                  <div class="text-xl font-semibold text-gray-800">{{ flight?.departure }}</div>
                  <div class="text-gray-600">{{ flight?.departureAirport }}</div>
                  <mat-chip class="mt-2 bg-blue-100 text-blue-800">Départ</mat-chip>
                </div>

                <div class="flex-1 flex items-center justify-center px-8">
                  <div class="flex items-center gap-3 text-gray-400">
                    <div class="h-px bg-gray-300 flex-1"></div>
                    <div class="text-center">
                      <mat-icon class="text-blue-500 text-2xl">flight_takeoff</mat-icon>
                      <div class="text-sm font-semibold text-gray-600 mt-1">
                        {{ flight?.duration }}
                      </div>
                      @if (flight?.stops === 0) {
                        <div class="text-xs text-green-600 font-semibold">Vol direct</div>
                      } @else {
                        <div class="text-xs text-orange-600 font-semibold">
                          {{ flight?.stops }} escale(s)
                        </div>
                      }
                    </div>
                    <div class="h-px bg-gray-300 flex-1"></div>
                  </div>
                </div>

                <div class="text-center flex-1">
                  <div class="text-3xl font-bold text-blue-800 mb-1">
                    {{ flight?.arrivalTime }}
                  </div>
                  <div class="text-xl font-semibold text-gray-800">{{ flight?.destination }}</div>
                  <div class="text-gray-600">{{ flight?.destinationAirport }}</div>
                  <mat-chip class="mt-2 bg-green-100 text-green-800">Arrivée</mat-chip>
                </div>
              </div>
              <div class="text-center text-gray-600">{{ flight?.date }}</div>
            </div>
          </mat-card>

          <!-- Informations passager -->
          <mat-card class="mb-6 p-6 shadow-2xl">
            <div class="flex items-center gap-3 mb-6">
              <mat-icon class="text-blue-600 text-2xl">person</mat-icon>
              <h3 class="text-xl font-semibold text-gray-800">Informations passager</h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <mat-form-field class="w-full">
                <mat-label>Nom</mat-label>
                <input matInput [(ngModel)]="passenger.name" required />
                <mat-icon matSuffix>person</mat-icon>
              </mat-form-field>

              <mat-form-field class="w-full">
                <mat-label>Prénom</mat-label>
                <input matInput [(ngModel)]="passenger.surname" required />
                <mat-icon matSuffix>person</mat-icon>
              </mat-form-field>

              <mat-form-field class="w-full">
                <mat-label>Type de passager</mat-label>
                <mat-select [(ngModel)]="passenger.type">
                  <mat-option value="Adulte">Adulte (12+ ans)</mat-option>
                  <mat-option value="Enfant">Enfant (2-11 ans)</mat-option>
                  <mat-option value="Bébé">Bébé (0-23 mois)</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field class="w-full">
                <mat-label>Date de naissance</mat-label>
                <input matInput type="date" [(ngModel)]="passenger.birthDate" required />
                <mat-icon matSuffix>cake</mat-icon>
              </mat-form-field>
            </div>
          </mat-card>

          <!-- Options supplémentaires -->
          <mat-card class="mb-6 p-6 shadow-2xl">
            <div class="flex items-center gap-3 mb-6">
              <mat-icon class="text-blue-600 text-xl">add_circle</mat-icon>
              <h3 class="text-xl font-semibold text-gray-800">Options supplémentaires</h3>
            </div>

            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div class="flex items-center gap-3">
                  <mat-icon class="text-blue-600">luggage</mat-icon>
                  <div>
                    <div class="font-semibold">Bagage en soute (23kg)</div>
                    <div class="text-sm text-gray-600">Ajoutez un bagage enregistré</div>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <span class="font-bold text-blue-600">+25€</span>
                  <mat-checkbox [(ngModel)]="extras.luggage"></mat-checkbox>
                </div>
              </div>

              <div class="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div class="flex items-center gap-3">
                  <mat-icon class="text-blue-600">airline_seat_recline_extra</mat-icon>
                  <div>
                    <div class="font-semibold">Siège avec espace supplémentaire</div>
                    <div class="text-sm text-gray-600">Plus de confort pour vos jambes</div>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <span class="font-bold text-blue-600">+15€</span>
                  <mat-checkbox [(ngModel)]="extras.extraSeat"></mat-checkbox>
                </div>
              </div>

              <div class="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div class="flex items-center gap-3">
                  <mat-icon class="text-blue-600">restaurant</mat-icon>
                  <div>
                    <div class="font-semibold">Repas à bord</div>
                    <div class="text-sm text-gray-600">Menu spécialement préparé</div>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <span class="font-bold text-blue-600">+12€</span>
                  <mat-checkbox [(ngModel)]="extras.meal"></mat-checkbox>
                </div>
              </div>
            </div>
          </mat-card>
        </div>

        <!-- Résumé et paiement -->
        <div class="lg:col-span-1">
          <div class="sticky top-8">
            <mat-card class="p-6 shadow-2xl">
              <div class="flex items-center gap-3 mb-6">
                <mat-icon class="text-green-600 text-2xl">payment</mat-icon>
                <h3 class="text-xl font-semibold text-gray-800">Résumé de la commande</h3>
              </div>

              <div class="space-y-3 mb-6">
                <div class="flex justify-between">
                  <span class="text-gray-600">Vol {{ flight?.flightNumber }}</span>
                  <span class="font-semibold">{{ flight?.price }}€</span>
                </div>

                @if (extras.luggage) {
                  <div class="flex justify-between">
                    <span class="text-gray-600">Bagage en soute</span>
                    <span class="font-semibold">25€</span>
                  </div>
                }

                @if (extras.extraSeat) {
                  <div class="flex justify-between">
                    <span class="text-gray-600">Siège confort</span>
                    <span class="font-semibold">15€</span>
                  </div>
                }

                @if (extras.meal) {
                  <div class="flex justify-between">
                    <span class="text-gray-600">Repas à bord</span>
                    <span class="font-semibold">12€</span>
                  </div>
                }

                <mat-divider></mat-divider>

                <div class="flex justify-between text-lg font-bold text-blue-600">
                  <span>Total</span>
                  <span>{{ getTotalPrice() }}€</span>
                </div>
              </div>

              <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div class="flex items-center gap-2 text-green-800">
                  <mat-icon class="text-sm">check_circle</mat-icon>
                  <span class="font-semibold">Réservation sécurisée</span>
                </div>
                <p class="text-sm text-green-700 mt-1">
                  Paiement crypté SSL et annulation gratuite sous 24h
                </p>
              </div>

              <button
                mat-raised-button
                color="primary"
                size="large"
                class="w-full px-8 py-3 text-lg"
                (click)="confirmBooking()"
                [disabled]="!isFormValid()"
              >
                <mat-icon class="mr-2">lock</mat-icon>
                Confirmer et payer {{ getTotalPrice() }}€
              </button>

              <div class="flex items-center justify-center gap-4 mt-4 text-gray-500">
                <mat-icon class="text-sm">security</mat-icon>
                <span class="text-xs">Paiement 100% sécurisé</span>
              </div>
            </mat-card>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class BookingComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly flightService = inject(FlightService);
  private readonly router = inject(Router);
  private readonly bookingService = inject(BookingService);
  private readonly authService = inject(AuthService);

  private readonly location = inject(Location);

  flight: Flight | undefined;

  passenger: Booking['passenger'] = {
    name: '',
    surname: '',
    type: 'Adulte',
    birthDate: '',
  };

  extras: Booking['extras'] = {
    luggage: false,
    extraSeat: false,
    meal: false,
  };

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.flight = this.flightService.getFlights().find((f) => f.id === id);
    }
  }

  goBack() {
    this.location.back();
  }

  getTotalPrice(): number {
    let total = this.flight?.price || 0;
    if (this.extras.luggage) total += 25;
    if (this.extras.extraSeat) total += 15;
    if (this.extras.meal) total += 12;
    return total;
  }

  isFormValid(): boolean {
    return !!(this.passenger.name && this.passenger.surname && this.passenger.birthDate);
  }

  confirmBooking() {
    if (this.isFormValid() && this.flight) {
      const currentUser = this.authService.getCurrentUser();

      if (currentUser) {
        const newBookingData = {
          user: currentUser,
          flight: this.flight,
          passenger: this.passenger,
          extras: this.extras,
          totalPrice: this.getTotalPrice(),
        };

        this.bookingService.addBooking(newBookingData);

        alert('Réservation confirmée !');
        this.router.navigate(['/my-bookings']);
      }
    }
  }
}
