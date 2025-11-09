import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

/**
 * Application routes with lazy loading for optimal performance
 */
export const routes: Routes = [
  {
    path: '',
    redirectTo: '/movies',
    pathMatch: 'full'
  },
  {
    path: 'movies',
    loadComponent: () => import('./features/movies/movies').then(m => m.Movies),
    title: 'Now Playing - MovieApp'
  },
  {
    path: 'movies/:id',
    loadComponent: () => import('./features/movie-detail/movie-detail').then(m => m.MovieDetail),
    title: 'Movie Details - MovieApp'
  },
  {
    path: 'search',
    loadComponent: () => import('./features/search/search').then(m => m.Search),
    title: 'Search Movies - MovieApp'
  },
  {
    path: 'wishlist',
    loadComponent: () => import('./features/wishlist/wishlist').then(m => m.Wishlist),
    canActivate: [authGuard],
    title: 'My Wishlist - MovieApp'
  },
  {
    path: 'account',
    loadComponent: () => import('./features/account/account').then(m => m.Account),
    canActivate: [authGuard],
    title: 'My Account - MovieApp'
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then(m => m.Login),
        title: 'Login - MovieApp'
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register').then(m => m.Register),
        title: 'Register - MovieApp'
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/movies'
  }
];
