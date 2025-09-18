// src/app/booking/models/booking.ts
import { Flight } from '../../flights/models/flight';
import { User } from '../../auth/models/user';

export interface Booking {
  id: string;
  user: User; // utilisateur connecté qui réserve
  flight: Flight; // vol réservé
  passenger: {
    name: string;
    surname: string;
    type: 'adulte' | 'enfant' | 'bébé';
    birthDate: string;
  };
  extras: {
    luggage: boolean;
    extraSeat: boolean;
    meal: boolean;
  };
  totalPrice: number;
  createdAt: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
}
