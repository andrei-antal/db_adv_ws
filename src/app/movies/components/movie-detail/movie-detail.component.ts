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
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { iif, tap } from 'rxjs';
import { EMPTY_MOVIE, Movie } from '../../model/movie';
import { MovieService } from '../../services/movie.service';
import { MovieItemComponent } from '../movie-item/movie-item.component';
import { MovieImageFallbackDirective } from '../../../directives/movie-image-fallback/movie-image-fallback.directive';

@Component({
  selector: 'ngm-movie-detail',
  standalone: true,
  imports: [
    RouterModule,
    MovieItemComponent,
    ReactiveFormsModule,
    MovieImageFallbackDirective,
  ],
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieDetailComponent {
  readonly #fb = inject(FormBuilder);
  readonly #router = inject(Router);
  readonly #movieService = inject(MovieService);

  id = input<string>('');

  #movie = signal<Movie>(EMPTY_MOVIE);
  #isNewMovie = computed(() => !this.id());

  constructor() {
    effect((onCleanup) => {
      const id = this.id();
      if (id) {
        const sub = this.#movieService.getMovie(id).subscribe((movie) => {
          this.movieForm.patchValue(movie);
          this.#movie.set(movie);
        });
        onCleanup(() => sub.unsubscribe());
      }
    });
  }

  movieForm = this.#fb.group({
    title: this.#fb.control('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    genre: this.#fb.control('', {
      nonNullable: true,
      validators: Validators.required,
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
  });

  onSubmit(): void {
    const { value } = this.movieForm;
    const modifiedMovie: Movie = {
      ...this.#movie(),
      ...value,
    };
    iif(
      () => this.#isNewMovie(),
      this.#movieService
        .createMovie(modifiedMovie)
        .pipe(tap(() => 'Movie created')),
      this.#movieService
        .updateMovie(modifiedMovie)
        .pipe(tap(() => 'Movie updated'))
    ).subscribe(() => this.goBack());
  }

  goBack() {
    this.#router.navigate(['/movies']);
  }
}
