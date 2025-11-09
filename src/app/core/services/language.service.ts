import { Injectable, signal, effect } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';

/**
 * Service for managing application language and RTL support
 */
@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly STORAGE_KEY = 'movie_app_language';
  private readonly document = inject(DOCUMENT);

  // Available languages
  readonly supportedLanguages = environment.supportedLanguages || ['en', 'ar', 'fr', 'zh'];
  
  // Reactive language state
  private languageSignal = signal<string>(this.getStoredLanguage());
  
  // Public getter for current language
  readonly currentLanguage = this.languageSignal.asReadonly();

  constructor() {
    // Effect to update document language and direction
    effect(() => {
      const lang = this.languageSignal();
      this.updateDocumentLanguage(lang);
    });
  }

  /**
   * Change application language
   */
  setLanguage(lang: string): void {
    if (this.supportedLanguages.includes(lang)) {
      this.languageSignal.set(lang);
      localStorage.setItem(this.STORAGE_KEY, lang);
    }
  }

  /**
   * Get language name for display
   */
  getLanguageName(code: string): string {
    const names: Record<string, string> = {
      'en': 'English',
      'ar': 'العربية',
      'fr': 'Français',
      'zh': '中文'
    };
    return names[code] || code;
  }

  /**
   * Check if current language is RTL
   */
  isRTL(): boolean {
    return this.languageSignal() === 'ar';
  }

  /**
   * Private methods
   */
  private getStoredLanguage(): string {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored && this.supportedLanguages.includes(stored) 
      ? stored 
      : (environment.defaultLanguage || 'en');
  }

  private updateDocumentLanguage(lang: string): void {
    const htmlElement = this.document.documentElement;
    htmlElement.lang = lang;
    htmlElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }
}
