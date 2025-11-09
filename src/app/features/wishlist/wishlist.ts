import { Component, inject, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MovieCard } from '../../shared/components/movie-card/movie-card';
import { WishlistService, AuthService, NotificationService, TmdbApiService, LanguageService } from '../../core/services';
import { Movie } from '../../core/models/movie.model';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Component({
  selector: 'app-wishlist',
  imports: [CommonModule, MovieCard, RouterLink],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css',
})
export class Wishlist {
  private readonly wishlistService = inject(WishlistService);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly tmdbService = inject(TmdbApiService);
  private readonly languageService = inject(LanguageService);

  // Use a signal to store updated wishlist with current language
  private updatedWishlist = signal<Movie[]>([]);
  private isInitialized = false;

  wishlist = computed(() => {
    // If we have updated data, use it; otherwise use the stored wishlist
    const updated = this.updatedWishlist();
    return updated.length > 0 ? updated : this.wishlistService.wishlist();
  });

  wishlistCount = computed(() => this.wishlistService.wishlistCount());
  isAuthenticated = computed(() => this.authService.isAuthenticated());

  constructor() {
    // Reload wishlist movies when language changes
    effect(() => {
      this.languageService.currentLanguage(); // Track language changes
      if (this.isInitialized && this.isAuthenticated()) {
        this.refreshWishlistData();
      }
      this.isInitialized = true;
    });

    // Load initial data if authenticated
    if (this.isAuthenticated()) {
      this.refreshWishlistData();
    }
  }

  /**
   * Refresh wishlist data from API with current language
   */
  private refreshWishlistData(): void {
    const storedWishlist = this.wishlistService.wishlist();
    if (storedWishlist.length === 0) {
      this.updatedWishlist.set([]);
      return;
    }

    // Fetch updated details for each movie from API
    const requests = storedWishlist.map(movie =>
      this.tmdbService.getMovieDetails(movie.id).pipe(
        catchError(() => of(movie)) // If fails, use stored data
      )
    );

    forkJoin(requests).subscribe({
      next: (updatedMovies) => {
        // Convert MovieDetail to Movie format and update
        const movies = updatedMovies.map(m => {
          const hasGenres = 'genres' in m;
          return {
            id: m.id,
            title: m.title,
            poster_path: m.poster_path,
            backdrop_path: m.backdrop_path,
            overview: m.overview,
            release_date: m.release_date,
            vote_average: m.vote_average,
            vote_count: m.vote_count,
            popularity: m.popularity,
            genre_ids: hasGenres ? (m as any).genres.map((g: any) => g.id) : []
          } as Movie;
        });
        this.updatedWishlist.set(movies);
      }
    });
  }

  // Navigation methods (kept for programmatic navigation if needed)
  private navigateToLogin(): void {
    this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl: this.router.url }
    });
  }

  onWishlistToggle(movie: Movie): void {
    if (this.authService.isAuthenticated()) {
      this.wishlistService.toggleWishlist(movie);
      this.notificationService.info('Movie removed from wishlist');
      // Refresh the list after removal
      this.refreshWishlistData();
    } else {
      this.navigateToLogin();
    }
  }

  clearWishlist(): void {
    if (confirm('Are you sure you want to clear your entire wishlist?')) {
      this.wishlistService.clearWishlist();
      this.updatedWishlist.set([]);
      this.notificationService.success('Wishlist cleared');
    }
  }
}
