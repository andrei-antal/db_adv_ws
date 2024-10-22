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
import { iif, tap } from 'rxjs';
import { EMPTY_MOVIE, Movie } from '../../model/movie';
import { MovieService } from '../../services/movie.service';
import { MovieItemComponent } from '../movie-item/movie-item.component';
import { MovieImageFallbackDirective } from '../../../directives/movie-image-fallback/movie-image-fallback.directive';
import {
  genreValidator,
  sciFiGenreYearValidator,
} from '../../services/movies.validators';
import { GENRES } from '../../model/movie-data';

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
  readonly genres = GENRES;

  id = input<string>('');

  #movie = signal<Movie>(EMPTY_MOVIE);
  #isNewMovie = computed(() => !this.id());

  constructor() {
    effect((onCleanup) => {
      const id = this.id();
      if (id) {
        const sub = this.#movieService.getMovie(id).subscribe((movie) => {
          const genre = movie.genre
            .split(',')
            .map((g) => g.trim().toLowerCase());
          genre.forEach(() => this.addGenre());
          this.movieForm.patchValue({ ...movie, genre });
          this.#movie.set(movie);
        });
        onCleanup(() => sub.unsubscribe());
      }
    });
  }

  movieForm = this.#fb.group(
    {
      title: this.#fb.control('', {
        nonNullable: true,
        validators: Validators.required,
      }),
      genre: this.#fb.nonNullable.array([] as string[], {
        validators: genreValidator,
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

  get genreArray(): FormArray {
    return this.movieForm.get('genre') as FormArray;
  }

  onSubmit(): void {
    const { value } = this.movieForm;
    const modifiedMovie: Movie = {
      ...this.#movie(),
      ...value,
      genre: value.genre!.filter((g: string) => g).join(', '),
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

  addGenre(): void {
    this.genreArray.push(this.#fb.nonNullable.control(''));
  }

  removeGenre(index: number): void {
    this.genreArray.removeAt(index);
  }
}
