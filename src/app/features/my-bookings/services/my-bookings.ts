import { Injectable, inject } from '@angular/core';
import { Booking } from '../../booking/models/booking';
import { AuthService } from '../../auth/services/auth';
import { BookingService } from '../../booking/services/booking';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MyBookingsService {
  private readonly authService = inject(AuthService);
  private readonly bookingService = inject(BookingService);

  getMyBookings(): Booking[] {
    const currentUser = this.authService.getCurrentUser();
    const allBookings = this.bookingService.getBookings();

    if (!currentUser) {
      return [];
    }

    return allBookings.filter((booking) => booking.user.id === currentUser.id);
  }

  getBookingById(id: string): Booking | undefined {
    return this.bookingService.getBookings().find((booking) => booking.id === id);
  }

  cancelBooking(id: string): boolean {
    const booking = this.getBookingById(id);
    if (booking && booking.status === 'confirmed') {
      // On met à jour le statut
      const updatedBooking = { ...booking, status: 'cancelled' as const };
      // On demande au service master de faire la mise à jour
      return this.bookingService.updateBooking(id, updatedBooking);
    }
    return false;
  }

  deleteMyBooking(id: string): Observable<void> {
    return this.bookingService.deleteBooking(id);
  }
}
