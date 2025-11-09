import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService, WishlistService } from '../../core/services';


@Component({
  selector: 'app-account',
  imports: [CommonModule, RouterLink],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class Account {
  private readonly authService = inject(AuthService);
  private readonly wishlistService = inject(WishlistService);

  readonly currentUser = this.authService.currentUser;
  readonly wishlistCount = this.wishlistService.wishlistCount;

  getMembershipDuration(): string {
    const user = this.currentUser();
    if (!user) return '';
    
    const now = new Date();
    const registered = new Date(user.registeredAt);
    const diffTime = Math.abs(now.getTime() - registered.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} days`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years > 1 ? 's' : ''}`;
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
