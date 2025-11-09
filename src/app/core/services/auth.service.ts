import { Injectable, signal, computed, inject, Injector, runInInjectionContext } from '@angular/core';
import { Router } from '@angular/router';
import { User, LoginCredentials, RegisterData, AuthResponse } from '../models/user.model';

/**
 * Authentication service using LocalStorage
 * In production, this should be replaced with a real backend API
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'movie_app_user';
  private readonly USERS_KEY = 'movie_app_users';
  private readonly router = inject(Router);
  private readonly injector = inject(Injector);

  // Reactive state using signals
  private currentUserSignal = signal<User | null>(this.getUserFromStorage());

  // Public computed properties
  readonly currentUser = computed(() => this.currentUserSignal());
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);

  // Wishlist service reference
  private _wishlistService: any;

  constructor() {
    // Load user from localStorage on service initialization
    const user = this.getUserFromStorage();
    if (user) {
      this.currentUserSignal.set(user);
      // Initialize wishlist for this user
      setTimeout(() => this.initializeWishlist(user.id), 0);
    }
  }

  private get wishlistService(): any {
    if (!this._wishlistService) {
      // Lazy load wishlist service
      runInInjectionContext(this.injector, async () => {
        const { WishlistService } = await import('./wishlist.service');
        this._wishlistService = inject(WishlistService);
      });
    }
    return this._wishlistService;
  }

  private initializeWishlist(userId: string): void {
    // Asynchronously initialize wishlist
    runInInjectionContext(this.injector, async () => {
      const { WishlistService } = await import('./wishlist.service');
      const service = inject(WishlistService);
      service.initializeForUser(userId);
    });
  }

  /**
   * Register a new user
   */
  register(data: RegisterData): AuthResponse {
    // Validate input
    if (!data.name || !data.email || !data.password) {
      return { success: false, message: 'All fields are required' };
    }

    if (data.password !== data.confirmPassword) {
      return { success: false, message: 'Passwords do not match' };
    }

    if (data.password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters' };
    }

    // Check if user already exists
    const users = this.getAllUsers();
    const existingUser = users.find(u => u.email === data.email);

    if (existingUser) {
      return { success: false, message: 'Email already registered' };
    }

    // Create new user
    const newUser: User = {
      id: this.generateId(),
      name: data.name,
      email: data.email,
      registeredAt: new Date(),
      avatar: this.generateAvatar(data.name)
    };

    // Store user credentials separately (in production, hash passwords!)
    users.push(newUser);
    this.saveAllUsers(users);
    
    // Store password hash (simplified for demo - use bcrypt in production!)
    const credentials = this.getCredentials();
    credentials[data.email] = this.simpleHash(data.password);
    localStorage.setItem('movie_app_credentials', JSON.stringify(credentials));

    // Auto-login after registration
    this.setCurrentUser(newUser);
    this.initializeWishlist(newUser.id);

    return { success: true, user: newUser };
  }

  /**
   * Login with email and password
   */
  login(credentials: LoginCredentials): AuthResponse {
    const users = this.getAllUsers();
    const user = users.find(u => u.email === credentials.email);

    if (!user) {
      return { success: false, message: 'Invalid email or password' };
    }

    // Verify password
    const storedCredentials = this.getCredentials();
    const hashedPassword = this.simpleHash(credentials.password);

    if (storedCredentials[credentials.email] !== hashedPassword) {
      return { success: false, message: 'Invalid email or password' };
    }

    this.setCurrentUser(user);
    this.initializeWishlist(user.id);
    return { success: true, user };
  }

  /**
   * Logout current user
   */
  logout(): void {
    // Clear user-specific wishlist
    runInInjectionContext(this.injector, async () => {
      const { WishlistService } = await import('./wishlist.service');
      const service = inject(WishlistService);
      service.clearUserData();
    });
    
    this.currentUserSignal.set(null);
    localStorage.removeItem(this.STORAGE_KEY);
    this.router.navigate(['/auth/login']);
  }

  /**
   * Update user profile
   */
  updateProfile(updates: Partial<User>): AuthResponse {
    const currentUser = this.currentUserSignal();
    if (!currentUser) {
      return { success: false, message: 'No user logged in' };
    }

    const updatedUser = { ...currentUser, ...updates };
    
    // Update in users list
    const users = this.getAllUsers();
    const index = users.findIndex(u => u.id === currentUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      this.saveAllUsers(users);
    }

    this.setCurrentUser(updatedUser);
    return { success: true, user: updatedUser };
  }

  /**
   * Private helper methods
   */
  private setCurrentUser(user: User): void {
    this.currentUserSignal.set(user);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  }

  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem(this.STORAGE_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  private getAllUsers(): User[] {
    const usersJson = localStorage.getItem(this.USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  }

  private saveAllUsers(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  private getCredentials(): Record<string, string> {
    const credJson = localStorage.getItem('movie_app_credentials');
    return credJson ? JSON.parse(credJson) : {};
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private generateAvatar(name: string): string {
    // Use UI Avatars service for demo
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=E50914&color=fff&size=200`;
  }

  private simpleHash(str: string): string {
    // Simple hash for demo - use bcrypt or similar in production!
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }
}
