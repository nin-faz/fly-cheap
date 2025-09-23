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

  // GET
  readMyAccount(): Observable<User | null> {
    const user = this.authService.getCurrentUser();
    return of(user);
  }

  // PUT
  updateMyAccount(updatedData: Partial<User>): Observable<User> {
    const user = this.authService.getCurrentUser();
    if (user) {
      return this.authService.updateUser(user.id, updatedData);
    }
    return throwError(() => new Error('Utilisateur non connecté'));
  }

  // DELETE
  deleteMyAccount(): Observable<void> {
    const user = this.authService.getCurrentUser();
    if (user) {
      return this.authService.deleteUser(user.id).pipe(
        tap(() => {
          // Logout automatique after account deletion
          this.authService.logout();
        }),
      );
    }
    return throwError(() => new Error('Utilisateur non connecté'));
  }
}
