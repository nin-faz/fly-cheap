import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { AuthService } from '../../auth/services/auth';
import { UserService } from '../services/user';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="bg-white rounded-xl shadow-md border border-gray-100 p-8 mb-8">
          <div class="flex items-center space-x-6">
            <div
              class="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg"
            >
              <span class="text-white text-2xl font-bold">{{ getInitials() }}</span>
            </div>
            <div>
              <h1 class="text-3xl font-bold text-gray-900 mb-2">Mon compte</h1>
              <p class="text-gray-600 text-lg">Gérez vos informations personnelles</p>
            </div>
          </div>
        </div>

        <!-- Account form -->
        <div class="bg-white rounded-xl shadow-md border border-gray-100" *ngIf="user()">
          <div class="p-8">
            <form #userForm="ngForm" (ngSubmit)="onSave()">
              <h2 class="text-2xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-200">
                Informations personnelles
              </h2>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label for="name" class="block text-sm font-semibold text-gray-700">
                    Nom complet *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    [(ngModel)]="user()!.name"
                    required
                    minlength="2"
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Entrez votre nom complet"
                  />
                </div>

                <div class="space-y-2">
                  <label for="phone" class="block text-sm font-semibold text-gray-700">
                    Numéro de téléphone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    [(ngModel)]="user()!.phone"
                    pattern="^[0-9+-.s()]+$"
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Ex: 06.12.34.56.78"
                  />
                </div>

                <div class="space-y-2">
                  <label for="email" class="block text-sm font-semibold text-gray-700">Email</label>
                  <input
                    id="email"
                    type="email"
                    [value]="user()?.email"
                    disabled
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                  />
                  <p class="text-xs text-gray-500">L'email ne peut pas être modifié</p>
                </div>

                <div class="space-y-2">
                  <div class="block text-sm font-semibold text-gray-700">Statut du compte</div>
                  <div class="pt-3">
                    <span
                      class="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold"
                      [ngClass]="{
                        'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300':
                          user()?.role === 'admin',
                        'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300':
                          user()?.role === 'user',
                      }"
                    >
                      {{ user()?.role === 'admin' ? 'Administrateur' : 'Utilisateur' }}
                    </span>
                  </div>
                </div>

                <!-- Account creation date -->
                <div class="space-y-2 md:col-span-2">
                  <div class="block text-sm font-semibold text-gray-700">Membre depuis</div>
                  <p class="text-gray-600 text-lg">{{ formatDate(user()?.createdAt) }}</p>
                </div>
              </div>

              <!-- Action buttons -->
              <div class="flex flex-col sm:flex-row gap-4 mt-10 pt-8 border-t border-gray-200">
                <button
                  type="submit"
                  [disabled]="isLoading()"
                  class="flex-1 relative overflow-hidden bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <span *ngIf="!isLoading(); else loading" class="flex items-center justify-center">
                    <svg
                      class="mr-2"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                    Enregistrer les modifications
                  </span>
                  <ng-template #loading>
                    <span class="flex items-center justify-center">
                      <svg
                        class="animate-spin mr-2"
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="12" r="10" stroke-opacity="0.3"></circle>
                        <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
                      </svg>
                      Enregistrement...
                    </span>
                  </ng-template>
                </button>

                <button
                  type="button"
                  (click)="onDelete()"
                  class="px-8 py-4 border-2 border-red-200 text-red-700 rounded-xl font-semibold hover:bg-red-50 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
                >
                  <span class="flex items-center justify-center">
                    <svg
                      class="mr-2"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      ></path>
                    </svg>
                    Supprimer le compte
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AccountComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  user = signal<User | null>(null);
  isLoading = signal(false);

  ngOnInit(): void {
    this.userService.readMyAccount().subscribe((user) => {
      if (user) this.user.set({ ...user });
    });
  }

  // GET
  getInitials(): string {
    const user = this.user();
    if (!user?.name) return '?';
    return user.name
      .split(' ')
      .map((n) => n.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  }

  formatDate(date?: Date): string {
    if (!date) return '-';
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  }

  onSave(): void {
    if (!this.user()) return;

    this.isLoading.set(true);
    this.userService
      .updateMyAccount({ name: this.user()!.name, phone: this.user()!.phone })
      .subscribe({
        next: (updated) => {
          this.authService.setCurrentUser(updated);
          this.user.set({ ...updated });
          alert('Profil mis à jour avec succès');
          this.isLoading.set(false);
        },
        error: (err) => {
          alert(err.message || 'Erreur lors de la mise à jour');
          this.isLoading.set(false);
        },
      });
  }

  onDelete(): void {
    if (!this.user()) return;

    if (confirm('Voulez-vous vraiment supprimer votre compte ? Cette action est irréversible.')) {
      this.userService.deleteMyAccount().subscribe({
        next: () => {
          alert("Compte supprimé avec succès. Vous allez être redirigé vers l'accueil.");
          this.router.navigate(['/']);
        },
        error: (err) => alert(err.message || 'Erreur lors de la suppression'),
      });
    }
  }
}
