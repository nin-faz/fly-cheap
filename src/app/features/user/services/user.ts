import { Injectable, inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth';
import { User } from '../models/user';
import { Observable, of, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly authService = inject(AuthService);

  readMyAccount(): Observable<User | null> {
    const user = this.authService.getCurrentUser();
    return of(user);
  }

  updateMyAccount(updatedData: Partial<User>): Observable<User> {
    const user = this.authService.getCurrentUser();
    if (user) {
      // Déléguer la mise à jour à AuthService
      return this.authService.updateUser(user.id, updatedData);
    }
    return throwError(() => new Error('Utilisateur non connecté'));
  }

  deleteMyAccount(): Observable<void> {
    const user = this.authService.getCurrentUser();
    if (user) {
      return this.authService.deleteUser(user.id).pipe(
        tap(() => {
          // Logout automatique après suppression du compte
          this.authService.logout();
        }),
      );
    }
    return throwError(() => new Error('Utilisateur non connecté'));
  }
}
