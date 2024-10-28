import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { iif, Observable, of, tap } from 'rxjs';
import { EMPTY_MOVIE, Movie } from '../../model/movie';
import { MovieService } from '../../services/movie.service';
import { MovieItemComponent } from '../movie-item/movie-item.component';
import { MovieImageFallbackDirective } from '../../../directives/movie-image-fallback/movie-image-fallback.directive';
import {
  genreValidator,
  sciFiGenreYearValidator,
} from '../../services/movies.validators';
import { GENRES } from '../../model/movie-data';
import { GenreControlComponent } from '../genre-control/genre-control.component';
import { getMovieById, MovieState } from '../../store/movies.reducers';
import { select, Store } from '@ngrx/store';
import { addMovie, updateMovie } from '../../store/movies.actions';

@Component({
  selector: 'ngm-movie-detail',
  standalone: true,
  imports: [
    RouterModule,
    MovieItemComponent,
    ReactiveFormsModule,
    MovieImageFallbackDirective,
    GenreControlComponent,
  ],
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieDetailComponent {
  readonly #fb = inject(FormBuilder);
  readonly #router = inject(Router);
  readonly #movieService = inject(MovieService);
  readonly genres = GENRES;
  readonly store = inject(Store<MovieState>);

  id = input<string>('');

  #movie = signal<Movie>(EMPTY_MOVIE);
  #isNewMovie = computed(() => !this.id());
  #changesSaved = false;

  constructor() {
    effect(
      (onCleanup) => {
        const id = this.id();
        if (id) {
          const sub = this.store
            .pipe(select(getMovieById({ movieId: id })))
            .subscribe((movie) => {
              if (movie) {
                this.movieForm.patchValue(movie);
                this.#movie.set(movie);
              }
            });
          onCleanup(() => sub.unsubscribe());
        }
      },
      { allowSignalWrites: true }
    );
  }

  movieForm = this.#fb.group(
    {
      title: this.#fb.control('', {
        nonNullable: true,
        validators: Validators.required,
      }),
      genre: this.#fb.control('', {
        nonNullable: true,
        validators: Validators.required,
        updateOn: 'change',
      }),
      year: this.#fb.control('', {
        nonNullable: true,
        validators: Validators.required,
      }),
      plot: this.#fb.control('', {
        nonNullable: true,
        validators: Validators.required,
      }),
      poster: this.#fb.control('', { nonNullable: true }),
    },
    { validators: sciFiGenreYearValidator, updateOn: 'blur' }
  );

  onSubmit(): void {
    const { value } = this.movieForm;
    const modifiedMovie: Movie = {
      ...this.#movie(),
      ...value,
    };
    if (this.#isNewMovie()) {
      this.store.dispatch(addMovie(modifiedMovie));
    } else {
      this.store.dispatch(updateMovie(modifiedMovie));
    }

    this.#changesSaved = true;
    this.goBack();
  }

  goBack() {
    this.#router.navigate(['/movies']);
  }

  confirmCancel(): Observable<boolean> {
    if (!this.#changesSaved && this.movieForm.dirty) {
      return of(
        window.confirm('You have unsaved changes. Do you really want to leave?')
      );
    }
    return of(true);
  }
}
