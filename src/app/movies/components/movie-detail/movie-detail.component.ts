import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { iif, map, switchMap, tap } from 'rxjs';
import { Movie } from '../../model/movie';
import { MovieService } from '../../services/movie.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'ngm-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieDetailComponent implements OnInit {
  readonly #destroyRef = inject(DestroyRef);
  readonly #fb = inject(FormBuilder);
  readonly #route = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly #movieService = inject(MovieService);

  #isNewMovie!: boolean;
  #movie!: Movie;

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

  ngOnInit(): void {
    this.#route.paramMap
      .pipe(
        map((paramsMap) => paramsMap.get('id') as string),
        tap((movieId) => (this.#isNewMovie = !movieId)),
        switchMap((movieId) =>
          this.#movieService
            .getMovie(movieId)
            .pipe(tap((movie) => (this.#movie = movie)))
        ),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe((movie) => this.movieForm.patchValue(movie));
  }

  onSubmit(): void {
    const { value } = this.movieForm;
    const modifiedMovie: Movie = {
      ...this.#movie,
      ...value,
    };

    iif(
      () => this.#isNewMovie,
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
