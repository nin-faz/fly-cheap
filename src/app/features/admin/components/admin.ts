import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth';
import { User } from '../../user/models/user';
import { Booking } from '../../booking/models/booking';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { forkJoin } from 'rxjs';
import { BookingService } from '../../booking/services/booking';
import { StatusHighlightDirective } from '../../../shared/directives/status-highlight.directive';
import { PricePipe } from '../../../shared/pipes/price.pipe';
import { StatusPipe } from '../../../shared/pipes/status.pipe';
import { NotificationService } from '../../../shared/services/notification';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    StatusHighlightDirective,
    PricePipe,
    StatusPipe,
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <mat-card class="mb-8 p-6">
          <div class="flex items-center gap-4">
            <mat-icon class="text-blue-600 mb-5">admin_panel_settings</mat-icon>
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Interface d'Administration</h1>
              <p class="text-gray-600 mt-1">
                Gérez les utilisateurs et les réservations de FlyCheap
              </p>
            </div>
          </div>
        </mat-card>

        <!-- Statistiques -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <mat-card class="p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <mat-icon class="text-blue-600 text-3xl">people</mat-icon>
              </div>
              <div class="ml-4">
                <p class="text-2xl font-bold text-gray-900">{{ users().length }}</p>
                <p class="text-sm text-gray-600">Utilisateurs</p>
              </div>
            </div>
          </mat-card>

          <mat-card class="p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <mat-icon class="text-green-600 text-3xl">flight</mat-icon>
              </div>
              <div class="ml-4">
                <p class="text-2xl font-bold text-gray-900">{{ bookings().length }}</p>
                <p class="text-sm text-gray-600">Réservations</p>
              </div>
            </div>
          </mat-card>

          <mat-card class="p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <mat-icon class="text-yellow-600 text-3xl">euro</mat-icon>
              </div>
              <div class="ml-4">
                <p class="text-2xl font-bold text-gray-900">{{ getTotalRevenue() | price }}</p>
                <p class="text-sm text-gray-600">Chiffre d'affaires</p>
              </div>
            </div>
          </mat-card>
        </div>

        <!-- Onglets -->
        <mat-card>
          <mat-tab-group [(selectedIndex)]="selectedTabIndex">
            <mat-tab label="Utilisateurs">
              <div class="p-6">
                @if (users().length > 0) {
                  <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-gray-50">
                        <tr>
                          <th
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Utilisateur
                          </th>
                          <th
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Rôle
                          </th>
                          <th
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Téléphone
                          </th>
                          <th
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        @for (user of users(); track user.id) {
                          <tr>
                            <td class="px-6 py-4 whitespace-nowrap">
                              <div class="flex items-center">
                                <div class="flex-shrink-0 h-10 w-10">
                                  <div
                                    class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center"
                                  >
                                    <span class="text-sm font-medium text-blue-700">
                                      {{ getUserInitials(user) }}
                                    </span>
                                  </div>
                                </div>
                                <div class="ml-4">
                                  <div class="text-sm font-medium text-gray-900">
                                    {{ getUserFullName(user) }}
                                  </div>
                                  <div class="text-sm text-gray-500">{{ user.email }}</div>
                                </div>
                              </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                              <span
                                [class.bg-red-100]="user.role === 'admin'"
                                [class.text-red-800]="user.role === 'admin'"
                                [class.bg-blue-100]="user.role === 'user'"
                                [class.text-blue-800]="user.role === 'user'"
                                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                              >
                                {{ user.role | titlecase }}
                              </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {{ user.phone || 'Non renseigné' }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              @if (user.role !== 'admin') {
                                <button
                                  mat-button
                                  style="color: red;"
                                  (click)="deleteUser(user.id)"
                                >
                                  <mat-icon>delete</mat-icon>
                                  Supprimer
                                </button>
                              } @else {
                                <span class="text-gray-400">Admin protégé</span>
                              }
                            </td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                } @else {
                  <div class="text-center py-8">
                    <mat-icon class="text-gray-400 text-6xl mb-4">people</mat-icon>
                    <p class="text-gray-500">Aucun utilisateur trouvé</p>
                  </div>
                }
              </div>
            </mat-tab>

            <mat-tab label="Réservations">
              <div class="p-6">
                @if (bookings().length > 0) {
                  <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-gray-50">
                        <tr>
                          <th
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Réservation
                          </th>
                          <th
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Client
                          </th>
                          <th
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Vol
                          </th>
                          <th
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Prix
                          </th>
                          <th
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Statut
                          </th>
                          <th
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        @for (booking of bookings(); track booking.id) {
                          <tr>
                            <td class="px-6 py-4 whitespace-nowrap">
                              <div class="text-sm font-medium text-gray-900">#{{ booking.id }}</div>
                              <div class="text-sm text-gray-500">
                                {{ booking.createdAt | date: 'dd/MM/yyyy' }}
                              </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {{ booking.user.email }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                              <div class="text-sm font-medium text-gray-900">
                                {{ booking.flight.departure }} → {{ booking.flight.destination }}
                              </div>
                              <div class="text-sm text-gray-500">
                                {{ booking.flight.date | date: 'dd/MM/yyyy' }}
                              </div>
                            </td>
                            <td
                              class="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600"
                            >
                              {{ booking.totalPrice | price }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                              <span
                                [appStatusHighlight]="booking.status"
                                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                              >
                                {{ booking.status | status }}
                              </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                mat-button
                                color="primary"
                                (click)="viewBooking(booking)"
                                class="mr-2"
                              >
                                <mat-icon>visibility</mat-icon>
                                Voir
                              </button>
                              <button
                                mat-button
                                style="color: red;"
                                (click)="deleteBooking(booking.id)"
                              >
                                <mat-icon>delete</mat-icon>
                                Supprimer
                              </button>
                            </td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                } @else {
                  <div class="text-center py-8">
                    <mat-icon class="text-gray-400 text-6xl mb-4">flight</mat-icon>
                    <p class="text-gray-500">Aucune réservation trouvée</p>
                  </div>
                }
              </div>
            </mat-tab>
          </mat-tab-group>
        </mat-card>
      </div>
    </div>
  `,
})
export class AdminComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly bookingService = inject(BookingService);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  selectedTabIndex = signal<number>(0);
  users = signal<User[]>([]);
  bookings = signal<Booking[]>([]);
  isLoading = signal<boolean>(false);

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      this.router.navigate(['/']);
      return;
    }
    this.loadData();
  }

  private loadData() {
    this.isLoading.set(true);

    /*
    Operator that launches several observables in parallel and waits for all of them to finish
    I find it better to do it this way than to load them one at a time (users and bookings).
    */
    forkJoin({
      users: this.authService.getAllUsers(),
      bookings: this.bookingService.getAllBookings(),
    }).subscribe({
      next: ({ users, bookings }) => {
        this.users.set(users);
        this.bookings.set(bookings);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données:', error);
        this.isLoading.set(false);
      },
    });
  }

  deleteUser(userId: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.authService.deleteUser(userId).subscribe({
        next: () => {
          this.loadData();
          this.notificationService.showSuccess('Utilisateur supprimé avec succès');
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          this.notificationService.showError("Erreur lors de la suppression de l'utilisateur");
        },
      });
    }
  }

  async deleteBooking(bookingId: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      try {
        const deleted = await this.bookingService.deleteBooking(bookingId);
        if (deleted) {
          this.loadData();
          this.notificationService.showSuccess('Réservation supprimée avec succès');
        } else {
          this.notificationService.showWarning('Réservation introuvable');
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        this.notificationService.showError('Erreur lors de la suppression de la réservation');
      }
    }
  }

  viewBooking(booking: Booking) {
    this.notificationService.showInfo(
      `Détails de la réservation: ${booking.passenger.name} ${booking.passenger.surname} - Vol ${booking.flight.flightNumber}`,
    );
  }

  getUserInitials(user: User): string {
    const name = user.name || user.email;
    const nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  }

  getUserFullName(user: User): string {
    return user.name;
  }

  getTotalRevenue(): number {
    return this.bookings().reduce((total, booking) => {
      if (booking.status === 'confirmed') {
        return total + booking.totalPrice;
      }
      return total;
    }, 0);
  }
}
