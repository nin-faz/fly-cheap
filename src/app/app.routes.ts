import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
// import { adminGuard } from './core/guards/admin-guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/home/home.routes').then((m) => m.HOME_ROUTES),
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'flights',
    loadChildren: () => import('./features/flights/flight.route').then((m) => m.FLIGHT_ROUTES),
  },
  {
    path: 'booking',
    canActivate: [authGuard],
    loadChildren: () => import('./features/booking/booking.route').then((m) => m.BOOKING_ROUTES),
  },
  // {
  //   path: 'account',
  //   canActivate: [authGuard],
  //   loadChildren: () => import('./features/user/user.routes').then((m) => m.USER_ROUTES),
  // },
  // {
  //   path: 'bookings',
  //   canActivate: [authGuard],
  //   loadChildren: () => import('./features/booking/booking.routes').then((m) => m.BOOKING_ROUTES),
  // },
  // {
  //   path: 'admin',
  //   canActivate: [adminGuard],
  //   loadChildren: () => import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  // },
];
