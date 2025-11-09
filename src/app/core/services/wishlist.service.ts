import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { Movie } from '../models/movie.model';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';

/**
 * Service for managing user's wishlist using LocalStorage
 * Each user has their own wishlist stored separately
 */
@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly STORAGE_KEY_PREFIX = 'movie_app_wishlist_';
  private currentUserId: string | null = null;
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  constructor() {
    // Initialize with current user if already logged in
    const currentUser = this.authService.currentUser();
    if (currentUser) {
      this.initializeForUser(currentUser.id);
    }

    // Subscribe to auth state changes
    effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        this.initializeForUser(user.id);
      } else {
        this.clearUserData();
      }
    });
  }

  // Reactive wishlist state
  private wishlistSignal = signal<Movie[]>([]);

  // Public computed properties
  readonly wishlist = this.wishlistSignal.asReadonly();
  readonly wishlistCount = computed(() => this.wishlistSignal().length);

  /**
   * Initialize wishlist for a specific user
   */
  initializeForUser(userId: string): void {
    console.log('Initializing wishlist for user:', userId);
    this.currentUserId = userId;
    const loadedWishlist = this.loadWishlist();
    console.log('Setting wishlist signal with:', loadedWishlist);
    this.wishlistSignal.set(loadedWishlist);
  }

  /**
   * Clear user data on logout
   */
  clearUserData(): void {
    this.currentUserId = null;
    this.wishlistSignal.set([]);
  }

  /**
   * Check if user is authenticated before wishlist operations
   */
  private checkAuth(): boolean {
    if (!this.authService.isAuthenticated()) {
      this.notificationService.error('Please login to add to wishlist');
      return false;
    }
    return true;
  }

  /**
   * Add movie to wishlist
   */
  addToWishlist(movie: Movie): void {
    if (!this.checkAuth()) {
      // Redirect to login with return URL
      this.router.navigate(['/auth/login'], { 
        queryParams: { returnUrl: this.router.url } 
      });
      return;
    }
    
    const currentWishlist = this.wishlistSignal();
    
    if (!this.isInWishlist(movie.id)) {
      const updatedWishlist = [...currentWishlist, movie];
      this.wishlistSignal.set(updatedWishlist);
      this.saveWishlist(updatedWishlist);
      this.notificationService.success('Added to wishlist!');
    } else {
      this.notificationService.info('Already in your wishlist');
    }
  }

  /**
   * Remove movie from wishlist
   */
  removeFromWishlist(movieId: number): void {
    if (!this.checkAuth()) return;
    
    const currentWishlist = this.wishlistSignal();
    const updatedWishlist = currentWishlist.filter(m => m.id !== movieId);
    this.wishlistSignal.set(updatedWishlist);
    this.saveWishlist(updatedWishlist);
    this.notificationService.warning('Removed from wishlist');
  }

  /**
   * Toggle movie in wishlist
   */
  toggleWishlist(movie: Movie): void {
    if (!this.checkAuth()) {
      this.router.navigate(['/auth/login'], { 
        queryParams: { returnUrl: this.router.url } 
      });
      return;
    }
    
    if (this.isInWishlist(movie.id)) {
      this.removeFromWishlist(movie.id);
    } else {
      this.addToWishlist(movie);
    }
  }

  /**
   * Check if movie is in wishlist
   */
  isInWishlist(movieId: number): boolean {
    return this.wishlistSignal().some(m => m.id === movieId);
  }

  /**
   * Clear entire wishlist
   */
  clearWishlist(): void {
    if (!this.checkAuth()) return;
    
    this.wishlistSignal.set([]);
    this.saveWishlist([]);
    this.notificationService.info('Wishlist cleared');
  }

  /**
   * Get wishlist as array
   */
  getWishlistMovies(): Movie[] {
    return this.wishlistSignal();
  }

  /**
   * Private methods
   */
  private loadWishlist(): Movie[] {
    if (!this.currentUserId) {
      console.log('No user ID, returning empty wishlist');
      return [];
    }
    
    const storageKey = this.STORAGE_KEY_PREFIX + this.currentUserId;
    console.log('Loading wishlist for user:', this.currentUserId, 'from key:', storageKey);
    const wishlistJson = localStorage.getItem(storageKey);
    const wishlist = wishlistJson ? JSON.parse(wishlistJson) : [];
    console.log('Loaded wishlist:', wishlist);
    return wishlist;
  }

  private saveWishlist(wishlist: Movie[]): void {
    if (!this.currentUserId) {
      console.log('No user ID, cannot save wishlist');
      return;
    }
    
    const storageKey = this.STORAGE_KEY_PREFIX + this.currentUserId;
    console.log('Saving wishlist for user:', this.currentUserId, 'to key:', storageKey, 'data:', wishlist);
    localStorage.setItem(storageKey, JSON.stringify(wishlist));
  }
}
