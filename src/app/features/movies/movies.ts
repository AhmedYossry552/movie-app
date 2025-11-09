import { Component, OnInit, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TmdbApiService, NotificationService, LanguageService } from '../../core/services';
import { Movie, Genre } from '../../core/models/movie.model';
import { MovieCard } from '../../shared/components/movie-card/movie-card';
import { SkeletonCard } from '../../shared/components/skeleton-card/skeleton-card';

@Component({
  selector: 'app-movies',
  imports: [CommonModule, FormsModule, MovieCard, SkeletonCard],
  templateUrl: './movies.html',
  styleUrl: './movies.css',
})
export class Movies implements OnInit {
  private readonly tmdbService = inject(TmdbApiService);
  private readonly notificationService = inject(NotificationService);
  private readonly languageService = inject(LanguageService);

  // Reactive state
  movies = signal<Movie[]>([]);
  genres = signal<Genre[]>([]);
  filteredMovies = signal<Movie[]>([]);
  loading = signal(true);
  currentPage = signal(1);
  totalPages = signal(1);
  private isInitialized = false;

  // Filter and sort state
  selectedGenre = '';
  sortBy = 'popularity';

  constructor() {
    // Reload data when language changes (skip first initialization)
    effect(() => {
      this.languageService.currentLanguage(); // Track language changes
      if (this.isInitialized) {
        this.loadGenres();
        this.loadMovies();
      }
      this.isInitialized = true;
    });
  }

  ngOnInit(): void {
    this.loadGenres();
    this.loadMovies();
  }

  loadGenres(): void {
    this.tmdbService.getGenres().subscribe({
      next: (response) => {
        this.genres.set(response.genres);
      },
      error: () => {
        this.notificationService.error('Failed to load genres');
      }
    });
  }

  loadMovies(): void {
    this.loading.set(true);
    
    const request = this.selectedGenre 
      ? this.tmdbService.getMoviesByGenre(Number(this.selectedGenre), this.currentPage())
      : this.tmdbService.getNowPlaying(this.currentPage());

    request.subscribe({
      next: (response) => {
        this.movies.set(response.results);
        this.totalPages.set(Math.min(response.total_pages, 500)); // TMDB API limit
        this.applySort();
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.notificationService.error('Failed to load movies');
      }
    });
  }

  onFilterChange(): void {
    this.currentPage.set(1);
    this.loadMovies();
  }

  onSortChange(): void {
    this.applySort();
  }

  applySort(): void {
    const sorted = [...this.movies()].sort((a, b) => {
      switch (this.sortBy) {
        case 'rating':
          return b.vote_average - a.vote_average;
        case 'release_date':
          return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
        case 'popularity':
        default:
          return b.popularity - a.popularity;
      }
    });
    this.filteredMovies.set(sorted);
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
      this.loadMovies();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
      this.loadMovies();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    this.loadMovies();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  visiblePages(): number[] {
    const current = this.currentPage();
    const total = this.totalPages();
    const delta = 2;
    const range: number[] = [];
    
    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
      range.push(i);
    }

    if (current - delta > 2) {
      range.unshift(-1); // Ellipsis
    }
    if (current + delta < total - 1) {
      range.push(-1); // Ellipsis
    }

    range.unshift(1);
    if (total > 1) {
      range.push(total);
    }

    return range.filter((v, i, a) => a.indexOf(v) === i && v > 0);
  }
}
