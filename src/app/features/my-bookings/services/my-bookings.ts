import { Injectable, inject, computed, signal } from '@angular/core';
import { Booking } from '../../booking/models/booking';
import { AuthService } from '../../auth/services/auth';
import { BookingService } from '../../booking/services/booking';

@Injectable({
  providedIn: 'root',
})
export class MyBookingsService {
  private readonly authService = inject(AuthService);
  private readonly bookingService = inject(BookingService);

  // Signal pour forcer la réactivité quand les bookings changent
  private readonly refreshTrigger = signal(0);

  // Signal computed pour les réservations de l'utilisateur connecté
  readonly myBookings = computed(() => {
    const currentUser = this.authService.getCurrentUser();
    return this.bookingService.bookings$().filter((b) => b.user.id === currentUser?.id);
  });

  // Signal computed pour les statistiques
  readonly confirmedBookingsCount = computed(
    () => this.myBookings().filter((b: Booking) => b.status === 'confirmed').length,
  );

  readonly totalSpent = computed(() =>
    this.myBookings().reduce((sum: number, booking: Booking) => sum + booking.totalPrice, 0),
  );

  async getMyBookings(): Promise<Booking[]> {
    const currentUser = this.authService.getCurrentUser();

    const allBookings = await this.bookingService.getAllBookings();
    const filtered = allBookings.filter((booking) => booking.user.id === currentUser?.id);

    // Mettre à jour le trigger pour la réactivité
    this.refreshTrigger.update((n) => n + 1);

    return filtered;
  }

  async getBookingById(id: string): Promise<Booking | undefined> {
    const allBookings = await this.bookingService.getAllBookings();
    return allBookings.find((booking: Booking) => booking.id === id);
  }

  async cancelBooking(id: string): Promise<boolean> {
    const booking = await this.getBookingById(id);
    if (booking && booking.status === 'confirmed') {
      // On met à jour le statut
      const updatedBooking = { ...booking, status: 'cancelled' as const };
      // On demande au service master de faire la mise à jour
      const result = await this.bookingService.updateBooking(id, updatedBooking);

      // Mettre à jour le trigger pour la réactivité
      this.refreshTrigger.update((n) => n + 1);

      return !!result;
    }
    return false;
  }

  async deleteMyBooking(id: string): Promise<boolean> {
    const result = await this.bookingService.deleteBooking(id);

    // Mettre à jour le trigger pour la réactivité
    this.refreshTrigger.update((n) => n + 1);

    return result;
  }
}
