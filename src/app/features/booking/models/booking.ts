import { Flight } from '../../flights/models/flight';
import { User } from '../../auth/models/user';

export interface Booking {
  id: string;
  user: User;
  flight: Flight;
  passenger: {
    name: string;
    surname: string;
    type: 'Adulte' | 'Enfant' | 'Bébé';
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
