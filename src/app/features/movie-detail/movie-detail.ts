import { Component, OnInit, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TmdbApiService, WishlistService, NotificationService, LanguageService } from '../../core/services';
import { MovieDetail as IMovieDetail, Movie, Video } from '../../core/models/movie.model';
import { MovieCard } from '../../shared/components/movie-card/movie-card';


@Component({
  selector: 'app-movie-detail',
  imports: [CommonModule, MovieCard],
  templateUrl: './movie-detail.html',
  styleUrl: './movie-detail.css',
})
export class MovieDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly tmdbService = inject(TmdbApiService);
  private readonly wishlistService = inject(WishlistService);
  private readonly notificationService = inject(NotificationService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly languageService = inject(LanguageService);

  movie = signal<IMovieDetail | null>(null);
  recommendations = signal<Movie[]>([]);
  trailer = signal<Video | null>(null);
  loading = signal(true);
  private currentMovieId = signal<number | null>(null);
  private isInitialized = false;

  constructor() {
    // Reload data when language changes (skip first initialization)
    effect(() => {
      this.languageService.currentLanguage(); // Track language changes
      const movieId = this.currentMovieId();
      if (this.isInitialized && movieId) {
        this.loadMovieDetails(movieId);
        this.loadRecommendations(movieId);
        this.loadTrailer(movieId);
      }
      this.isInitialized = true;
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = Number(params['id']);
      if (id) {
        this.currentMovieId.set(id);
        this.loadMovieDetails(id);
        this.loadRecommendations(id);
        this.loadTrailer(id);
      }
    });
  }

  loadMovieDetails(id: number): void {
    this.loading.set(true);
    this.tmdbService.getMovieDetails(id).subscribe({
      next: (movie) => {
        this.movie.set(movie);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.notificationService.error('Failed to load movie details');
      }
    });
  }

  loadRecommendations(id: number): void {
    this.tmdbService.getRecommendations(id).subscribe({
      next: (response) => {
        this.recommendations.set(response.results);
      }
    });
  }

  loadTrailer(id: number): void {
    this.tmdbService.getMovieVideos(id).subscribe({
      next: (response) => {
        const trailer = response.results.find(v => 
          v.type === 'Trailer' && v.site === 'YouTube'
        );
        if (trailer) {
          this.trailer.set(trailer);
        }
      }
    });
  }

  getPosterUrl(): string {
    return this.tmdbService.getImageUrl(this.movie()?.poster_path || null);
  }

  getBackdropUrl(): string {
    return this.tmdbService.getImageUrl(this.movie()?.backdrop_path || null, 'backdrop');
  }

  getTrailerUrl(): SafeResourceUrl {
    const key = this.trailer()?.key || '';
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      this.tmdbService.getYouTubeUrl(key)
    );
  }

  isInWishlist(): boolean {
    return this.movie() ? this.wishlistService.isInWishlist(this.movie()!.id) : false;
  }

  toggleWishlist(): void {
    const currentMovie = this.movie();
    if (currentMovie) {
      this.wishlistService.toggleWishlist(currentMovie as Movie);
      const message = this.isInWishlist() 
        ? 'Added to wishlist' 
        : 'Removed from wishlist';
      this.notificationService.success(message);
    }
  }

  formatCurrency(amount: number): string {
    if (amount === 0) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount);
  }

  goBack(): void {
    this.router.navigate(['/movies']);
  }
}
