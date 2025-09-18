import { Routes } from '@angular/router';
import { BookingComponent } from './components/booking';

export const BOOKING_ROUTES: Routes = [
  {
    path: ':id',
    component: BookingComponent,
  },
];
