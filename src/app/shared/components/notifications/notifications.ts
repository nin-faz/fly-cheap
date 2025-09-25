import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NotificationService } from '../../services/notification';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="fixed top-4 right-4 z-50 space-y-2">
      @for (notification of notificationService.notifications$(); track notification.id) {
        <div
          class="notification-toast w-fit max-w-md p-4 rounded-lg shadow-lg text-white flex items-center justify-between transform transition-all duration-300 ease-in-out"
          [class]="{
            'bg-red-500': notification.type === 'error',
            'bg-yellow-500': notification.type === 'warning',
            'bg-blue-500': notification.type === 'info',
            'bg-green-500': notification.type === 'success',
          }"
        >
          <div class="flex items-center space-x-2">
            <!-- Icon according to the type -->
            @if (notification.type === 'error') {
              <mat-icon>error</mat-icon>
            }
            @if (notification.type === 'warning') {
              <mat-icon>warning</mat-icon>
            }
            @if (notification.type === 'info') {
              <mat-icon>info</mat-icon>
            }
            @if (notification.type === 'success') {
              <mat-icon>check_circle</mat-icon>
            }
            <span class="text-sm font-medium">{{ notification.message }}</span>
          </div>
          <button
            (click)="notificationService.removeNotification(notification.id)"
            class="ml-4 hover:text-gray-200 flex-shrink-0"
            aria-label="Fermer la notification"
          >
            <mat-icon>close</mat-icon>
          </button>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .notification-toast {
        animation: slideInRight 0.3s ease-out;
      }

      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `,
  ],
})
export class NotificationsComponent {
  notificationService = inject(NotificationService);
}
