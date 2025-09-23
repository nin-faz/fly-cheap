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

  // Signal to force reactivity when bookings change
  private readonly refreshTrigger = signal(0);

  // GET
  async getMyBookings(): Promise<Booking[]> {
    const currentUser = this.authService.getCurrentUser();

    const allBookings = await this.bookingService.getAllBookings();
    const myBookings = allBookings.filter((booking) => booking.user.id === currentUser?.id);

    // Update the trigger for reactivity
    this.refreshTrigger.update((n) => n + 1);

    return myBookings;
  }

  // GET
  async getBookingById(id: string): Promise<Booking | undefined> {
    const allBookings = await this.bookingService.getAllBookings();
    return allBookings.find((booking: Booking) => booking.id === id);
  }

  async cancelBooking(id: string): Promise<boolean> {
    const booking = await this.getBookingById(id);
    if (booking && booking.status === 'confirmed') {
      const updatedBooking = { ...booking, status: 'cancelled' as const };
      const result = await this.bookingService.updateBooking(id, updatedBooking);

      // Update the trigger for reactivity
      this.refreshTrigger.update((n) => n + 1);

      // Convert result to boolean - true if booking was successfully updated
      return Boolean(result);
    }
    return false;
  }

  // DELETE
  async deleteMyBooking(id: string): Promise<boolean> {
    const result = await this.bookingService.deleteBooking(id);

    // Update the trigger for reactivity
    this.refreshTrigger.update((n) => n + 1);

    return result;
  }
}
