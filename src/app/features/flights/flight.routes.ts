import { Routes } from '@angular/router';
import { FlightDetailsComponent } from './components/flight-details';

export const FLIGHT_ROUTES: Routes = [
  {
    path: ':id',
    component: FlightDetailsComponent,
  },
];
