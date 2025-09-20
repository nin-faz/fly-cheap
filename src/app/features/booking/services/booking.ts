import { Injectable } from '@angular/core';
import { Booking } from '../models/booking';
import { delay, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private bookings: Booking[] = [];

  private readonly mockBookings: Booking[] = [
    {
      id: 'BK001',
      user: {
        id: 1,
        name: 'admin',
        email: 'admin@example.com',
        role: 'admin',
        createdAt: new Date('2025-01-01'),
      },
      flight: {
        id: '1',
        airline: 'Air France',
        flightNumber: 'AF123',
        departure: 'CDG',
        destination: 'JFK',
        departureAirport: 'Paris Charles de Gaulle',
        destinationAirport: 'New York JFK',
        departureTime: '10:30',
        arrivalTime: '14:45',
        duration: '8h15m',
        date: '2025-10-02',
        price: 450,
        stops: 0,
      },
      passenger: {
        name: 'Dupont',
        surname: 'Admin',
        type: 'Adulte',
        birthDate: '1985-03-15',
      },
      extras: {
        luggage: true,
        extraSeat: false,
        meal: true,
      },
      totalPrice: 487,
      createdAt: new Date('2025-09-15T14:30:00'),
      status: 'confirmed',
    },
    {
      id: 'BK002',
      user: {
        id: 2,
        name: 'user',
        email: 'user@example.com',
        role: 'user',
        createdAt: new Date('2025-01-01'),
      },
      flight: {
        id: '2',
        airline: 'Lufthansa',
        flightNumber: 'LH456',
        departure: 'BER',
        destination: 'NRT',
        departureAirport: 'Berlin Brandenburg',
        destinationAirport: 'Tokyo Narita',
        departureTime: '22:15',
        arrivalTime: '16:30+1',
        duration: '11h15m',
        date: '2025-11-15',
        price: 850,
        stops: 1,
      },
      passenger: {
        name: 'Martin',
        surname: 'User',
        type: 'Adulte',
        birthDate: '1990-07-22',
      },
      extras: {
        luggage: false,
        extraSeat: true,
        meal: false,
      },
      totalPrice: 865,
      createdAt: new Date('2025-09-18T09:15:00'),
      status: 'confirmed',
    },
  ];

  constructor() {
    this.loadBookingsFromStorage();
  }

  private saveBookings(bookings: Booking[]): void {
    localStorage.setItem('bookings', JSON.stringify(bookings));
  }

  private loadBookingsFromStorage(): void {
    const savedBookings = localStorage.getItem('bookings');
    if (savedBookings && savedBookings !== '[]') {
      this.bookings = JSON.parse(savedBookings);
    } else {
      this.bookings = this.mockBookings;
      this.saveBookings(this.bookings);
    }
  }

  getBookings(): Booking[] {
    return this.bookings;
  }

  getAllBookings(): Observable<Booking[]> {
    return of(this.bookings).pipe(delay(300));
  }

  addBooking(booking: Omit<Booking, 'id'>) {
    const newId = this.generateNewBookingId(this.bookings);

    const newBooking: Booking = {
      ...booking,
      id: newId,
    };

    this.bookings.push(newBooking);
    this.saveBookings(this.bookings);
  }

  updateBooking(id: string, updatedBooking: Booking): boolean {
    const index = this.bookings.findIndex((b) => b.id === id);
    if (index !== -1) {
      this.bookings[index] = updatedBooking;
      this.saveBookings(this.bookings);
      return true;
    }
    return false;
  }

  deleteBooking(id: string): Observable<void> {
    const index = this.bookings.findIndex((b) => b.id === id);
    if (index !== -1) {
      this.bookings.splice(index, 1);
      this.saveBookings(this.bookings);
      return of(void 0).pipe(delay(300));
    }
    return throwError(() => new Error('Réservation non trouvée'));
  }

  // Pour avoir un meilleur ID ressemblant
  private generateNewBookingId(bookings: Booking[]): string {
    // On cherche le plus grand ID numérique existant
    const maxId = bookings.reduce((max, b) => {
      const idNum = parseInt(b.id.replace('BK', ''), 10);
      return idNum > max ? idNum : max;
    }, 0);

    // On incrémente et on formate
    const newNumericId = maxId + 1;
    return `BK${newNumericId.toString().padStart(3, '0')}`;
  }
}
