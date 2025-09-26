import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth';
import { map, take } from 'rxjs/operators';
import { toObservable } from '@angular/core/rxjs-interop';
import { NotificationService } from '../../shared/services/notification';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const notificationService = inject(NotificationService);
  const router = inject(Router);

  return toObservable(authService.currentUser$).pipe(
    take(1),
    map((user) => {
      if (user) {
        return true;
      } else {
        router.navigate(['/auth/login'], {
          queryParams: { returnUrl: state.url },
        });
        notificationService.showWarning("Veuillez d'abord vous connecter !");

        return false;
      }
    }),
  );
};
