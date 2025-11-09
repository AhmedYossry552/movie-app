import { Component, Input, Output, EventEmitter, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Movie } from '../../../core/models/movie.model';
import { AuthService, TmdbApiService, WishlistService } from '../../../core/services';

@Component({
  selector: 'app-movie-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.css',
})
export class MovieCard {
 @Input({ required: true }) movie!: Movie;
  @Output() wishlistToggle = new EventEmitter<Movie>();

  private readonly tmdbService = inject(TmdbApiService);
  private readonly wishlistService = inject(WishlistService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Use computed for reactive wishlist state
  isInWishlist = computed<boolean>(() => this.wishlistService.isInWishlist(this.movie.id));

  getImageUrl(): string {
    return this.tmdbService.getImageUrl(this.movie.poster_path);
  }

  toggleWishlist(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    
    // Check authentication first
    if (!this.authService.isAuthenticated()) {
      // Store the current URL to redirect back after login
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return;
    }
    
    // Toggle wishlist
    this.wishlistService.toggleWishlist(this.movie);
    this.wishlistToggle.emit(this.movie);
  }
}
