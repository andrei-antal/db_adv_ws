import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  catchError,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { EMPTY_MOVIE, Movie } from '../model/movie';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  readonly #http = inject(HttpClient);
  readonly #movieApi = `${environment.apiUrl}/movies`;
  readonly #genreApi = `${environment.apiUrl}/genres`;
  readonly #reload = new BehaviorSubject<void>(undefined);

  getMovies(searchTerm = ''): Observable<Movie[]> {
    return this.#reload.pipe(
      switchMap(() =>
        this.#http
          .get<Movie[]>(`${this.#movieApi}?q=${searchTerm.trim()}`)
          .pipe(catchError(() => of([])))
      )
    );
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
