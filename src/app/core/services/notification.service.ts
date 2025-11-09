import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration: number;
}

/**
 * Notification service for displaying toast messages
 * Uses custom toast implementation
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private toastId = 0;
  readonly toasts = signal<Toast[]>([]);

  /**
   * Show success notification
   */
  success(message: string, duration = 3000): void {
    this.addToast(message, 'success', duration);
  }

  /**
   * Show error notification
   */
  error(message: string, duration = 5000): void {
    this.addToast(message, 'error', duration);
  }

  /**
   * Show info notification
   */
  info(message: string, duration = 3000): void {
    this.addToast(message, 'info', duration);
  }

  /**
   * Show warning notification
   */
  warning(message: string, duration = 4000): void {
    this.addToast(message, 'warning', duration);
  }

  /**
   * Show custom notification
   */
  show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration = 3000): void {
    this.addToast(message, type, duration);
  }

  private addToast(message: string, type: Toast['type'], duration: number): void {
    const id = ++this.toastId;
    const toast: Toast = { id, message, type, duration };
    
    this.toasts.update(toasts => [...toasts, toast]);

    // Auto remove after duration
    setTimeout(() => {
      this.removeToast(id);
    }, duration);
  }

  removeToast(id: number): void {
    this.toasts.update(toasts => toasts.filter(t => t.id !== id));
  }
}
