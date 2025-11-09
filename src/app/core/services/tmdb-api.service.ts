import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  MovieResponse, 
  MovieDetail, 
  GenreResponse, 
  VideoResponse 
} from '../models/movie.model';
import { LanguageService } from './language.service';

/**
 * Service for interacting with The Movie Database (TMDB) API
 * Provides methods for fetching movies, details, recommendations, search, etc.
 */
@Injectable({
  providedIn: 'root'
})
export class TmdbApiService {
  private readonly http = inject(HttpClient);
  private readonly languageService = inject(LanguageService);
  private readonly baseUrl = environment.tmdb.baseUrl;
  private readonly apiKey = environment.tmdb.apiKey;

  /**
   * Fetch now playing movies with pagination
   */
  getNowPlaying(page: number = 1): Observable<MovieResponse> {
    const params = this.buildParams({ page: page.toString() });
    return this.http.get<MovieResponse>(`${this.baseUrl}/movie/now_playing`, { params });
  }

  /**
   * Get detailed information about a specific movie
   */
  getMovieDetails(movieId: number): Observable<MovieDetail> {
    const params = this.buildParams();
    return this.http.get<MovieDetail>(`${this.baseUrl}/movie/${movieId}`, { params });
  }

  /**
   * Get movie recommendations based on a movie ID
   */
  getRecommendations(movieId: number): Observable<MovieResponse> {
    const params = this.buildParams();
    return this.http.get<MovieResponse>(`${this.baseUrl}/movie/${movieId}/recommendations`, { params });
  }

  /**
   * Get movie videos (trailers, teasers, etc.)
   */
  getMovieVideos(movieId: number): Observable<VideoResponse> {
    const params = this.buildParams();
    return this.http.get<VideoResponse>(`${this.baseUrl}/movie/${movieId}/videos`, { params });
  }

  /**
   * Search for movies by query string
   */
  searchMovies(query: string, page: number = 1): Observable<MovieResponse> {
    const params = this.buildParams({ query, page: page.toString() });
    return this.http.get<MovieResponse>(`${this.baseUrl}/search/movie`, { params });
  }

  /**
   * Get list of all movie genres
   */
  getGenres(): Observable<GenreResponse> {
    const params = this.buildParams();
    return this.http.get<GenreResponse>(`${this.baseUrl}/genre/movie/list`, { params });
  }

  /**
   * Get movies by genre
   */
  getMoviesByGenre(genreId: number, page: number = 1): Observable<MovieResponse> {
    const params = this.buildParams({ 
      with_genres: genreId.toString(), 
      page: page.toString() 
    });
    return this.http.get<MovieResponse>(`${this.baseUrl}/discover/movie`, { params });
  }

  /**
   * Get popular movies
   */
  getPopularMovies(page: number = 1): Observable<MovieResponse> {
    const params = this.buildParams({ page: page.toString() });
    return this.http.get<MovieResponse>(`${this.baseUrl}/movie/popular`, { params });
  }

  /**
   * Get top rated movies
   */
  getTopRatedMovies(page: number = 1): Observable<MovieResponse> {
    const params = this.buildParams({ page: page.toString() });
    return this.http.get<MovieResponse>(`${this.baseUrl}/movie/top_rated`, { params });
  }

  /**
   * Build image URL for movie posters and backdrops
   */
  getImageUrl(path: string | null, size: 'poster' | 'backdrop' | 'profile' = 'poster'): string {
    if (!path) return 'assets/images/no-image.png';
    const imageSize = environment.tmdb.imageSizes[size];
    return `${environment.tmdb.imageBaseUrl}/${imageSize}${path}`;
  }

  /**
   * Get YouTube trailer URL from video key
   */
  getYouTubeUrl(key: string): string {
    return `https://www.youtube.com/embed/${key}`;
  }

  /**
   * Build HTTP params with API key and current language
   */
  private buildParams(additionalParams: Record<string, string> = {}): HttpParams {
    let params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', this.languageService.currentLanguage());

    Object.entries(additionalParams).forEach(([key, value]) => {
      params = params.set(key, value);
    });

    return params;
  }
}
