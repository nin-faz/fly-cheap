import { Injectable, signal } from '@angular/core';

export interface Notification {
  id: string;
  message: string;
  type: 'error' | 'warning' | 'info' | 'success';
  timestamp: Date;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly notifications = signal<Notification[]>([]);
  public notifications$ = this.notifications.asReadonly();

  showError(message: string) {
    this.addNotification(message, 'error');
  }

  showWarning(message: string) {
    this.addNotification(message, 'warning');
  }

  showInfo(message: string) {
    this.addNotification(message, 'info');
  }

  showSuccess(message: string) {
    this.addNotification(message, 'success');
  }

  private addNotification(message: string, type: 'error' | 'warning' | 'info' | 'success') {
    const notification: Notification = {
      id: this.generateId(),
      message,
      type,
      timestamp: new Date(),
    };

    this.notifications.update((notifications) => [...notifications, notification]);

    // Auto-remove after 3 seconds (5 seconds for errors)
    const duration = type === 'error' ? 5000 : 3000;
    setTimeout(() => {
      this.removeNotification(notification.id);
    }, duration);
  }

  removeNotification(id: string) {
    this.notifications.update((notifications) =>
      notifications.filter((notification) => notification.id !== id),
    );
  }

  clearAll() {
    this.notifications.set([]);
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}
