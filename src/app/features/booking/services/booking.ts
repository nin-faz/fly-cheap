import { Injectable } from '@angular/core';
import { Booking } from '../models/booking';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private readonly storageKey = 'bookings';

  getBookings(): Booking[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  getBookingsByUser(userId: number): Booking[] {
    return this.getBookings().filter((b) => b.user.id === userId);
  }

  addBooking(booking: Booking) {
    const bookings = this.getBookings();
    bookings.push(booking);
    localStorage.setItem(this.storageKey, JSON.stringify(bookings));
  }
}
