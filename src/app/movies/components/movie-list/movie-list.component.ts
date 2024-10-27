import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  CommentUpdate,
  MovieItemComponent,
  RatingUpdate,
} from '../movie-item/movie-item.component';
import { MovieService } from '../../services/movie.service';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  scan,
  startWith,
  switchMap,
} from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { TmdbService } from '../../services/tmdb.service';
import { Movie } from '../../model/movie';
import { HasRoleDirective } from '../../../directives/has-role/has-role.directive';
import { Store } from '@ngrx/store';
import { getAllMovies, MovieState } from '../../store/movies.reducers';

@Component({
  selector: 'ngm-movie-list',
  standalone: true,
  imports: [
    CommonModule,
    MovieItemComponent,
    RouterModule,
    ReactiveFormsModule,
    HasRoleDirective,
  ],
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieListComponent {
  readonly #movieService = inject(MovieService);
  readonly #tmdbService = inject(TmdbService);
  readonly store = inject(Store<MovieState>);

  pageByScroll$ = fromEvent(window, 'scroll').pipe(
    map(() => window.scrollY),
    filter(
      (current) => current >= document.body.clientHeight - window.innerHeight
    ),
    debounceTime(200),
    distinctUntilChanged(),
    startWith(1),
    scan((page) => page + 1)
  );

  searchField = new FormControl('');
  movies$ = toSignal(
    this.searchField.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap(() => this.store.select(getAllMovies))
    )
  );

  tmdbMovies$ = toSignal(
    this.pageByScroll$.pipe(
      switchMap((page) => this.#tmdbService.getMovies(page)),
      scan<Movie[], Movie[]>(
        (existingMovies, newMovies) => [...existingMovies, ...newMovies],
        []
      )
    )
  );

  handleCommentUpdate(commentPayload: CommentUpdate): void {
    this.#movieService
      .updateComment(commentPayload.id, commentPayload.newComment)
      .subscribe();
  }

  handleMovieDelete(movieId: string): void {
    this.#movieService.deleteMovie(movieId).subscribe();
  }

  handleRateMovie(ratingPayload: RatingUpdate): void {
    this.#movieService
      .updateRating(ratingPayload.id, ratingPayload.newRating)
      .subscribe();
  }
}
