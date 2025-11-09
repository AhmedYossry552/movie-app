import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { 
  AuthService, 
  ThemeService, 
  LanguageService, 
  WishlistService 
} from '../../../core/services';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private readonly authService = inject(AuthService);
  private readonly themeService = inject(ThemeService);
  private readonly languageService = inject(LanguageService);
  private readonly wishlistService = inject(WishlistService);
  private readonly router = inject(Router);

  // Reactive state
  readonly currentUser = this.authService.currentUser;
  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly wishlistCount = this.wishlistService.wishlistCount;
  readonly currentLanguage = this.languageService.currentLanguage;
  readonly supportedLanguages = this.languageService.supportedLanguages;

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  isDarkMode(): boolean {
    return this.themeService.isDarkMode();
  }

  changeLanguage(lang: string): void {
    this.languageService.setLanguage(lang);
  }

  getLanguageName(code: string): string {
    return this.languageService.getLanguageName(code);
  }

  logout(): void {
    this.authService.logout();
  }
}
