import { Component, EventEmitter, Output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
  ],
  template: `
    <mat-card class="p-6 shadow-xl rounded-2xl bg-white/90 backdrop-blur-sm">
      <h2 class="text-xl font-bold text-blue-700 mb-4">Rechercher votre vol idéal</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <mat-form-field appearance="fill" class="w-full">
          <mat-label>Départ</mat-label>
          <input
            matInput
            placeholder="Paris (CDG)"
            [value]="departure()"
            (input)="departure.set($any($event.target).value)"
          />
          <mat-icon matSuffix>flight_takeoff</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="fill" class="w-full">
          <mat-label>Arrivée</mat-label>
          <input
            matInput
            placeholder="New York (JFK)"
            [value]="destination()"
            (input)="destination.set($any($event.target).value)"
          />
          <mat-icon matSuffix>flight_land</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="fill" class="w-full">
          <mat-label>Date départ</mat-label>
          <input
            matInput
            type="date"
            [value]="departureDate()"
            (input)="departureDate.set($any($event.target).value)"
          />
          <mat-icon matSuffix>calendar_today</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="fill" class="w-full">
          <mat-label>Date retour</mat-label>
          <input
            matInput
            type="date"
            [value]="returnDate()"
            (input)="returnDate.set($any($event.target).value)"
          />
          <mat-icon matSuffix>calendar_today</mat-icon>
        </mat-form-field>
      </div>

      <button
        mat-raised-button
        color="primary"
        class="w-full md:w-auto text-lg px-8 py-3"
        [disabled]="!isFormValid()"
        (click)="onSubmit($event)"
      >
        <mat-icon class="mr-2">search</mat-icon>
        Rechercher les vols
      </button>
    </mat-card>
  `,
  styles: '',
})
export class SearchBarComponent {
  // Signals pour la réactivité
  readonly departure = signal<string>('');
  readonly destination = signal<string>('');
  readonly departureDate = signal<string>('');
  readonly returnDate = signal<string>('');

  // Signal computed pour valider le formulaire
  readonly isFormValid = computed(
    () =>
      this.departure().trim().length > 0 ||
      this.destination().trim().length > 0 ||
      this.departureDate().length > 0,
  );

  // Signal computed pour obtenir les données du formulaire
  readonly searchData = computed(() => ({
    departure: this.departure(),
    destination: this.destination(),
    departureDate: this.departureDate(),
    returnDate: this.returnDate(),
  }));

  // Ici on déclare un "canal de communication" vers le parent
  @Output() searchFlights = new EventEmitter<{
    departure: string;
    destination: string;
    departureDate: string;
    returnDate: string;
  }>();

  // appelé pour le ngSubmit
  onSubmit(evt: Event) {
    evt.preventDefault(); // empêche reload page

    if (!this.isFormValid()) {
      return;
    }

    const searchData = this.searchData();

    // ⚡ On envoie les infos au parent via l'EventEmitter
    this.searchFlights.emit(searchData);
  }
}
