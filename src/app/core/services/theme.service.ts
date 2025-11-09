import { Injectable, signal, effect } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';

export type Theme = 'light' | 'dark';

/**
 * Service for managing dark/light theme
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'movie_app_theme';
  private readonly document = inject(DOCUMENT);

  // Reactive theme state
  private themeSignal = signal<Theme>(this.getStoredTheme());
  
  // Public getter for current theme
  readonly currentTheme = this.themeSignal.asReadonly();

  constructor() {
    // Effect to update document theme
    effect(() => {
      const theme = this.themeSignal();
      this.applyTheme(theme);
    });
  }

  /**
   * Toggle between light and dark theme
   */
  toggleTheme(): void {
    const newTheme: Theme = this.themeSignal() === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  /**
   * Set specific theme
   */
  setTheme(theme: Theme): void {
    this.themeSignal.set(theme);
    localStorage.setItem(this.STORAGE_KEY, theme);
  }

  /**
   * Check if dark mode is active
   */
  isDarkMode(): boolean {
    return this.themeSignal() === 'dark';
  }

  /**
   * Private methods
   */
  private getStoredTheme(): Theme {
    const stored = localStorage.getItem(this.STORAGE_KEY) as Theme;
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    
    // Default to dark mode (Netflix style)
    return 'dark';
  }

  private applyTheme(theme: Theme): void {
    const htmlElement = this.document.documentElement;
    
    // Remove existing theme classes
    htmlElement.classList.remove('light', 'dark');
    
    // Add new theme class
    htmlElement.classList.add(theme);
    
    // Set data-theme for DaisyUI
    htmlElement.setAttribute('data-theme', theme);
  }
}
