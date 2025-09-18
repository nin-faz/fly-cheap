import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FlightService } from '../services/flight';
import { Flight } from '../models/flight';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-flight-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatDividerModule,
    RouterLink,
  ],
  template: `
    <div class="max-w-4xl mx-auto px-6">
      <!-- Header avec bouton retour -->
      <div class="flex items-center gap-4 mb-8">
        <button mat-icon-button (click)="goBack()" class="text-blue-600">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div>
          <h1 class="text-3xl font-bold text-blue-800">Détails du vol</h1>
          <p class="text-gray-600">Toutes les informations sur votre vol</p>
        </div>
      </div>

      @if (flight) {
        <!-- Card principale du vol -->
        <mat-card class="mb-8 overflow-hidden shadow-2xl">
          <div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <mat-icon class="text-2xl mb-6">flight</mat-icon>
                <div>
                  <h2 class="text-2xl font-bold">{{ flight.airline }}</h2>
                  <p class="text-blue-200">Vol {{ flight.flightNumber }}</p>
                </div>
              </div>
              <div class="text-right">
                <div class="text-3xl font-bold">{{ flight.price }}€</div>
                <div class="text-blue-200">par personne</div>
              </div>
            </div>
          </div>

          <div class="p-6">
            <!-- Itinéraire principal -->
            <div class="flex items-center justify-between mb-8">
              <div class="text-center flex-1">
                <div class="text-3xl font-bold text-blue-800 mb-1">
                  {{ flight.departureTime }}
                </div>
                <div class="text-xl font-semibold text-gray-800">{{ flight.departure }}</div>
                <div class="text-gray-600">{{ flight.departureAirport }}</div>
                <mat-chip class="mt-2 bg-blue-100 text-blue-800">Départ</mat-chip>
              </div>

              <div class="flex-1 flex items-center justify-center px-8">
                <div class="flex items-center gap-3 text-gray-400">
                  <div class="h-px bg-gray-300 flex-1"></div>
                  <div class="text-center">
                    <mat-icon class="text-blue-500 text-2xl">flight_takeoff</mat-icon>
                    <div class="text-sm font-semibold text-gray-600 mt-1">
                      {{ flight.duration }}
                    </div>
                    @if (flight.stops === 0) {
                      <div class="text-xs text-green-600 font-semibold">Vol direct</div>
                    } @else {
                      <div class="text-xs text-orange-600 font-semibold">
                        {{ flight.stops }} escale(s)
                      </div>
                    }
                  </div>
                  <div class="h-px bg-gray-300 flex-1"></div>
                </div>
              </div>

              <div class="text-center flex-1">
                <div class="text-3xl font-bold text-blue-800 mb-1">{{ flight.arrivalTime }}</div>
                <div class="text-xl font-semibold text-gray-800">{{ flight.destination }}</div>
                <div class="text-gray-600">{{ flight.destinationAirport }}</div>
                <mat-chip class="mt-2 bg-green-100 text-green-800">Arrivée</mat-chip>
              </div>
            </div>

            <mat-divider class="mb-6"></mat-divider>

            <!-- Informations détaillées -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <mat-icon class="text-blue-600">info</mat-icon>
                  Informations générales
                </h3>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Date du vol :</span>
                    <span class="font-semibold">{{ flight.date }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Compagnie :</span>
                    <span class="font-semibold">{{ flight.airline }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Numéro de vol :</span>
                    <span class="font-semibold">{{ flight.flightNumber }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Durée totale :</span>
                    <span class="font-semibold">{{ flight.duration }}</span>
                  </div>
                </div>
              </div>

              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <mat-icon class="text-green-600">euro</mat-icon>
                  Tarification
                </h3>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Prix de base :</span>
                    <span class="font-semibold">{{ flight.price }}€</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Taxes et frais :</span>
                    <span class="font-semibold">Inclus</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Bagage à main :</span>
                    <span class="font-semibold text-green-600">Inclus</span>
                  </div>
                  <mat-divider></mat-divider>
                  <div class="flex justify-between text-lg">
                    <span class="font-bold">Total par personne :</span>
                    <span class="font-bold text-blue-600">{{ flight.price }}€</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Avantages et services -->
            <div class="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <mat-icon class="text-blue-600">star</mat-icon>
                Avantages inclus
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex items-center gap-3">
                  <mat-icon class="text-green-600">check_circle</mat-icon>
                  <span>Sélection du siège gratuite</span>
                </div>
                <div class="flex items-center gap-3">
                  <mat-icon class="text-green-600">check_circle</mat-icon>
                  <span>Enregistrement en ligne</span>
                </div>
                <div class="flex items-center gap-3">
                  <mat-icon class="text-green-600">check_circle</mat-icon>
                  <span>Modification gratuite sous 24h</span>
                </div>
                <div class="flex items-center gap-3">
                  <mat-icon class="text-green-600">check_circle</mat-icon>
                  <span>Assurance annulation</span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-col md:flex-row gap-4 justify-center">
              <button
                mat-raised-button
                color="primary"
                size="large"
                class="px-8 py-3 text-lg"
                [routerLink]="['/booking', flight.id]"
              >
                <mat-icon class="mr-2">flight</mat-icon>
                Réserver ce vol - {{ flight.price }}€
              </button>
              <!-- <button mat-stroked-button color="primary" size="large" class="px-8 py-3">
                  <mat-icon class="mr-2">favorite_border</mat-icon>
                  Ajouter aux favoris
                </button> -->
              <!-- <button mat-stroked-button size="large" class="px-8 py-3">
                  <mat-icon class="mr-2">share</mat-icon>
                  Partager
                </button> -->
            </div>
          </div>
        </mat-card>

        <!-- Avis et recommandations -->
        <mat-card class="p-6 shadow-lg">
          <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <mat-icon class="text-yellow-600">star_rate</mat-icon>
            Avis sur cette compagnie
          </h3>
          <div class="flex items-center gap-4 mb-4">
            <div class="flex items-center gap-1">
              @for (star of [1, 2, 3, 4]; track star) {
                <mat-icon class="text-yellow-500">star</mat-icon>
              }
              <mat-icon class="text-gray-300">star</mat-icon>
            </div>
            <span class="text-gray-600">4.2/5 basé sur 1,254 avis</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div class="text-2xl font-bold text-blue-600">8.5/10</div>
              <div class="text-sm text-gray-600">Ponctualité</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-blue-600">8.1/10</div>
              <div class="text-sm text-gray-600">Confort</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-blue-600">7.9/10</div>
              <div class="text-sm text-gray-600">Service</div>
            </div>
          </div>
        </mat-card>
      } @else {
        <mat-card class="text-center p-12">
          <mat-icon class="text-6xl text-gray-400 mb-4">flight_off</mat-icon>
          <h3 class="text-2xl font-semibold text-gray-600 mb-2">Vol introuvable</h3>
          <p class="text-gray-500 mb-6">
            Le vol que vous recherchez n'existe pas ou n'est plus disponible.
          </p>
          <button mat-raised-button color="primary" (click)="goBack()">
            Retour à la recherche
          </button>
        </mat-card>
      }
    </div>
  `,
})
export class FlightDetailsComponent implements OnInit {
  flight: Flight | undefined;

  private readonly route = inject(ActivatedRoute);
  private readonly flightService = inject(FlightService);
  private readonly router = inject(Router);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.flight = this.flightService.getFlights().find((f) => f.id === id);
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
