import { Injectable, signal, computed } from '@angular/core';
import { LoginRequest, RegisterRequest } from '../models/user';
import { User } from '../../user/models/user';
import { BookingService } from '../../booking/services/booking';
import { Observable, of, throwError, delay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly currentUser = signal<User | null>(null);
  public currentUser$ = this.currentUser.asReadonly();

  private readonly bookingService = new BookingService();

  // Signal with computed property for admin check
  public isAdmin = computed(() => this.currentUser()?.role === 'admin');

  // Mocked user data
  private users: User[] = [
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      phone: '06.12.34.56.78',
      role: 'admin',
      createdAt: new Date('2024-01-01'),
    },
    {
      id: 2,
      name: 'Regular User',
      email: 'user@example.com',
      phone: '06.23.45.67.89',
      role: 'user',
      createdAt: new Date('2024-01-02'),
    },
  ];

  // Mock data - passwords (in reality, they would be hashed)
  private passwords: Record<string, string> = {
    'admin@example.com': 'admin123',
    'user@example.com': 'user123',
  };

  constructor() {
    this.loadUsersFromStorage();

    // Check if there is a user in session
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
    }
  }

  login(credentials: LoginRequest): Observable<User> {
    const user = this.users.find((u) => u.email === credentials.email);
    const password = this.passwords[credentials.email];

    if (user && password === credentials.password) {
      // Simulate network delay
      return of(user).pipe(delay(500));
    } else {
      return throwError(() => new Error('Email ou mot de passe incorrect'));
    }
  }

  register(userData: RegisterRequest): Observable<User> {
    // Check if email already exists
    const existingUser = this.users.find((u) => u.email === userData.email);
    if (existingUser) {
      return throwError(() => new Error('Cet email est déjà utilisé'));
    }

    const newUser: User = {
      id: this.users.length + 1,
      name: userData.name,
      phone: userData.phone,
      email: userData.email,
      role: 'user',
      createdAt: new Date(),
    };

    // Add to mock data
    this.users.push(newUser);
    this.passwords[userData.email] = userData.password;

    this.saveUsersToStorage();

    return of(newUser).pipe(delay(500));
  }

  // POST
  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
  }

  // GET
  getCurrentUser(): User | null {
    return this.currentUser();
  }

  // GET - Recup all users (admin only)
  getAllUsers(): Observable<User[]> {
    return of(this.users).pipe(delay(300));
  }

  // PUT
  updateUser(userId: number, updatedData: Partial<User>): Observable<User> {
    const user = this.users.find((u) => u.id === userId);
    if (user) {
      Object.assign(user, updatedData);
      this.saveUsersToStorage();
      return of(user).pipe(delay(300));
    }
    return throwError(() => new Error('Utilisateur non trouvé'));
  }

  // DELETE
  deleteUser(userId: number): Observable<void> {
    const index = this.users.findIndex((u) => u.id === userId);
    if (index !== -1) {
      const deletedUser = this.users[index];
      this.users.splice(index, 1);
      if (deletedUser && deletedUser.email) {
        delete this.passwords[deletedUser.email];
      }
      // Delete all bookings related to this user
      this.bookingService.deleteBookingsByUserId(userId);
      this.saveUsersToStorage();
      return of(void 0).pipe(delay(300));
    }
    return throwError(() => new Error('Utilisateur non trouvé'));
  }

  // GET
  getToken(): string | null {
    const user = this.currentUser();
    return user ? `mock-token-${user.id}` : null;
  }

  // SET
  setCurrentUser(user: User): void {
    this.currentUser.set(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  private saveUsersToStorage(): void {
    localStorage.setItem('users', JSON.stringify(this.users));
    localStorage.setItem('usersPassword', JSON.stringify(this.passwords));
  }

  private loadUsersFromStorage(): void {
    const savedUsers = localStorage.getItem('users');
    const savedPasswords = localStorage.getItem('usersPassword');

    if (savedUsers && savedPasswords) {
      this.users = JSON.parse(savedUsers);
      this.passwords = JSON.parse(savedPasswords);
    }
  }
}
