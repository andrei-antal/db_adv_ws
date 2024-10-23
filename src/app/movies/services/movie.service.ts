import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  interval,
  merge,
  of,
  shareReplay,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { EMPTY_MOVIE, Movie } from '../model/movie';
import { environment } from '../../../environments/environment';

const REFRESH_INTERVAL = 3000;

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  readonly #http = inject(HttpClient);
  readonly #movieApi = `${environment.apiUrl}/movies`;
  readonly #genreApi = `${environment.apiUrl}/genres`;
  readonly #reload = new BehaviorSubject<void>(undefined);
  readonly #clearCache = new Subject<void>();
  #cache!: Observable<Movie[]>;

  getMovies(
    searchTerm = '',
    refreshInterval = REFRESH_INTERVAL
  ): Observable<Movie[]> {
    const getMoviesApi = this.#http
      .get<Movie[]>(`${this.#movieApi}?q=${searchTerm.trim()}`)
      .pipe(catchError(() => of([])));

    if (searchTerm !== '') {
      return this.#reload.pipe(switchMap(() => getMoviesApi));
    } else if (!this.#cache) {
      this.#cache = merge(this.#reload, interval(refreshInterval)).pipe(
        switchMap(() => getMoviesApi),
        shareReplay(1),
        takeUntil(this.#clearCache)
      );
    }
    return this.#cache;
  }

  clearCache(): void {
    this.#clearCache.next();
  }

  updateComment(movieId: string, newComment: string): Observable<Movie> {
    return this.#http
      .patch<Movie>(`${this.#movieApi}/${movieId}`, { comment: newComment })
      .pipe(tap(() => this.#reload.next()));
  }

  deleteMovie(movieId: string): Observable<any> {
    return this.#http
      .delete(`${this.#movieApi}/${movieId}`)
      .pipe(tap(() => this.#reload.next()));
  }

  getMovie(movieId: string): Observable<Movie> {
    if (!movieId) {
      return of(EMPTY_MOVIE);
    }
    return this.#http.get<Movie>(`${this.#movieApi}/${movieId}`);
  }

  createMovie(movie: Movie): Observable<any> {
    return this.#http.post(`${this.#movieApi}`, movie);
  }

  updateMovie(movie: Movie): Observable<any> {
    return this.#http.put(`${this.#movieApi}/${movie.id}`, movie);
  }

  getGenres(): Observable<string[]> {
    return this.#http.get<string[]>(this.#genreApi);
  }

  updateRating(movieId: string, newRating: number): Observable<Movie> {
    return this.#http
      .patch<Movie>(`${this.#movieApi}/${movieId}`, { rating: newRating })
      .pipe(tap(() => this.#reload.next()));
  }
}
