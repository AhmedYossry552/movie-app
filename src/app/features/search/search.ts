import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { TmdbApiService, LanguageService } from '../../core/services';
import { Movie } from '../../core/models/movie.model';
import { MovieCard } from '../../shared/components/movie-card/movie-card';
import { SkeletonCard } from '../../shared/components/skeleton-card/skeleton-card';

@Component({
  selector: 'app-search',
  imports: [CommonModule, FormsModule, MovieCard, SkeletonCard],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {
  private readonly tmdbService = inject(TmdbApiService);
  private readonly languageService = inject(LanguageService);
  private searchSubject = new Subject<string>();
  private isInitialized = false;

  searchQuery = '';
  results = signal<Movie[]>([]);
  loading = signal(false);
  loadingMore = signal(false);
  currentPage = signal(1);
  totalPages = signal(1);
  hasMore = signal(false);

  constructor() {
    // Set up debounced search first
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(query => {
        if (!query.trim()) {
          this.results.set([]);
          this.loading.set(false);
          return [];
        }
        
        this.loading.set(true);
        this.currentPage.set(1);
        return this.tmdbService.searchMovies(query, 1);
      })
    ).subscribe({
      next: (response) => {
        if (response) {
          this.results.set(response.results);
          this.totalPages.set(response.total_pages);
          this.hasMore.set(this.currentPage() < this.totalPages());
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });

    // Re-search when language changes (skip first initialization)
    effect(() => {
      this.languageService.currentLanguage(); // Track language changes
      if (this.isInitialized && this.searchQuery.trim()) {
        this.searchSubject.next(this.searchQuery);
      }
      this.isInitialized = true;
    });
  }

  onSearchChange(query: string): void {
    this.searchSubject.next(query);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.results.set([]);
    this.currentPage.set(1);
    this.hasMore.set(false);
  }

  loadMore(): void {
    if (this.currentPage() >= this.totalPages()) return;
    
    this.loadingMore.set(true);
    const nextPage = this.currentPage() + 1;
    
    this.tmdbService.searchMovies(this.searchQuery, nextPage).subscribe({
      next: (response) => {
        this.results.update(current => [...current, ...response.results]);
        this.currentPage.set(nextPage);
        this.hasMore.set(nextPage < this.totalPages());
        this.loadingMore.set(false);
      },
      error: () => {
        this.loadingMore.set(false);
      }
    });
  }
}
