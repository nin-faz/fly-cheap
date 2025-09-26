import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth';
import { NotificationService } from '../../shared/services/notification';
import { map, take } from 'rxjs/operators';
import { toObservable } from '@angular/core/rxjs-interop';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const notificationService = inject(NotificationService);
  const router = inject(Router);

  return toObservable(authService.currentUser$).pipe(
    take(1),
    map((user) => {
      if (user && user.role === 'admin') {
        return true;
      } else {
        router.navigate(['/']);
        notificationService.showError("Vous n'avez pas accès. Réservé aux administrateurs.");
        return false;
      }
    }),
  );
};
