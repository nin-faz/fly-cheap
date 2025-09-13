import { Injectable, signal, computed } from '@angular/core';
import { User, LoginRequest, RegisterRequest } from '../models/user';
import { Observable, of, throwError, delay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly currentUser = signal<User | null>(null);
  public currentUser$ = this.currentUser.asReadonly();

  // Signal avec validation
  public isAdmin = computed(() => this.currentUser()?.role === 'admin');

  // Mock data - utilisateurs de test
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

  // Mock data - mots de passe (en réalité, ils seraient hashés)
  private passwords: Record<string, string> = {
    'admin@example.com': 'admin123',
    'user@example.com': 'user123',
  };

  constructor() {
    this.loadUsersFromStorage();

    // Vérifier s'il y a un utilisateur en session
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
    }
  }

  // POST - Connexion
  login(credentials: LoginRequest): Observable<User> {
    const user = this.users.find((u) => u.email === credentials.email);
    const password = this.passwords[credentials.email];

    if (user && password === credentials.password) {
      // Simuler un délai réseau
      return of(user).pipe(delay(500));
    } else {
      return throwError(() => new Error('Email ou mot de passe incorrect'));
    }
  }

  // POST - Inscription
  register(userData: RegisterRequest): Observable<User> {
    // Vérifier si l'email existe déjà
    const existingUser = this.users.find((u) => u.email === userData.email);
    if (existingUser) {
      return throwError(() => new Error('Cet email est déjà utilisé'));
    }

    // Créer un nouvel utilisateur
    const newUser: User = {
      id: this.users.length + 1,
      name: userData.name,
      phone: userData.phone,
      email: userData.email,
      role: 'user',
      createdAt: new Date(),
    };

    // Ajouter aux mock data
    this.users.push(newUser);
    this.passwords[userData.email] = userData.password;

    this.saveUsersToStorage();

    // Simuler un délai réseau
    return of(newUser).pipe(delay(500));
  }

  // POST - Déconnexion
  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
  }

  // GET - Récupérer l'utilisateur actuel
  getCurrentUser(): User | null {
    return this.currentUser();
  }

  // GET - Récupérer tous les utilisateurs (admin seulement)
  getAllUsers(): Observable<User[]> {
    return of(this.users).pipe(delay(300));
  }

  deleteUser(userId: number): Observable<void> {
    const index = this.users.findIndex((u) => u.id === userId);
    if (index !== -1) {
      const deletedUser = this.users[index];
      this.users.splice(index, 1);
      if (deletedUser && deletedUser.email) {
        delete this.passwords[deletedUser.email];
      }
      this.saveUsersToStorage();
      return of(void 0).pipe(delay(300));
    }
    return throwError(() => new Error('Utilisateur non trouvé'));
  }

  getToken(): string | null {
    const user = this.currentUser();
    return user ? `mock-token-${user.id}` : null;
  }

  // Méthode pour définir l'utilisateur connecté (utilisée après login)
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

  clearAllUserData(): void {
    localStorage.removeItem('users');
    localStorage.removeItem('usersPassword');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    this.loadUsersFromStorage();
  }
}
