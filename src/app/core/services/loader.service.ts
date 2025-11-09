import { Injectable, signal } from '@angular/core';

/**
 * Service for managing global loading state
 */
@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loadingSignal = signal<boolean>(false);
  private requestCount = 0;

  // Public getter for loading state
  readonly isLoading = this.loadingSignal.asReadonly();

  /**
   * Show loader
   */
  show(): void {
    this.requestCount++;
    this.loadingSignal.set(true);
  }

  /**
   * Hide loader
   */
  hide(): void {
    this.requestCount--;
    if (this.requestCount <= 0) {
      this.requestCount = 0;
      this.loadingSignal.set(false);
    }
  }

  /**
   * Force hide loader (reset count)
   */
  forceHide(): void {
    this.requestCount = 0;
    this.loadingSignal.set(false);
  }
}
