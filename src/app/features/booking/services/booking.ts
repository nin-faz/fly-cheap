import { Injectable, signal, computed, effect } from '@angular/core';
import { Booking } from '../models/booking';
import { Flight } from '../../flights/models/flight';
import { User } from '../../user/models/user';
@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private readonly bookings = signal<Booking[]>([
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
  ]);

  // Signal public en lecture seule
  public readonly bookings$ = this.bookings.asReadonly();

  constructor() {
    effect(() => {
      const bookings = this.bookings();
      localStorage.setItem('bookings', JSON.stringify(bookings));
    });

    this.loadBookingsFromStorage();
  }

  public confirmedBookings = computed(() =>
    this.bookings().filter((b) => b.status === 'confirmed'),
  );

  public bookingsByUser = (userId: number) =>
    computed(() => this.bookings().filter((b) => b.user.id === userId));

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private loadBookingsFromStorage(): void {
    const savedBookings = localStorage.getItem('bookings');
    if (savedBookings) {
      this.bookings.set(JSON.parse(savedBookings));
    }
  }

  // Pour avoir un meilleur ID ressemblant
  private generateNewBookingId(bookings: Booking[]): string {
    // On cherche le plus grand ID numérique existant
    const maxId = bookings.reduce((max, b) => {
      const idNum = parseInt(b.id.replace('BK', ''), 10);
      return idNum > max ? idNum : max;
    }, 0);

    // On incrémente et on formate
    return `BK${(maxId + 1).toString().padStart(3, '0')}`;
  }

  async getAllBookings(): Promise<Booking[]> {
    await this.delay(300);
    return this.bookings();
  }

  async addBooking(bookingData: {
    user: User;
    flight: Flight;
    passenger: Booking['passenger'];
    extras: Booking['extras'];
    totalPrice: number;
  }): Promise<Booking> {
    await this.delay(300);

    const extras = {
      luggage: bookingData.extras?.luggage ?? false,
      extraSeat: bookingData.extras?.extraSeat ?? false,
      meal: bookingData.extras?.meal ?? false,
    };

    const newBooking: Booking = {
      id: this.generateNewBookingId(this.bookings()),
      user: bookingData.user,
      flight: bookingData.flight,
      passenger: bookingData.passenger,
      extras,
      totalPrice: bookingData.totalPrice,
      createdAt: new Date(),
      status: 'confirmed',
    };

    this.bookings.update((list) => [...list, newBooking]);
    return newBooking;
  }

  async updateBooking(id: string, updates: Partial<Booking>) {
    await this.delay(300);

    let updatedBooking: Booking | undefined;

    this.bookings.update((bookings) =>
      bookings.map((booking) => {
        if (booking.id === id) {
          updatedBooking = {
            ...booking,
            ...updates,
          };
          return updatedBooking;
        }
        return booking;
      }),
    );

    return updatedBooking;
  }

  deleteBookingsByUserId(userId: number): void {
    this.bookings.update((list) => list.filter((b) => b.user.id !== userId));
  }

  async deleteBooking(id: string): Promise<boolean> {
    await this.delay(300);

    let deletedBooking = false;
    this.bookings.update((bookings) => {
      const initialLength = bookings.length;
      const filtered = bookings.filter((booking) => booking.id !== id);
      deletedBooking = filtered.length < initialLength;
      return filtered;
    });

    return deletedBooking;
  }
}
