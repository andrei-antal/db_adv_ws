import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  CommentUpdate,
  MovieItemComponent,
  RatingUpdate,
} from '../movie-item/movie-item.component';
import { MovieService } from '../../services/movie.service';
import { debounceTime, startWith, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'ngm-movie-list',
  standalone: true,
  imports: [
    CommonModule,
    MovieItemComponent,
    RouterModule,
    ReactiveFormsModule,
  ],
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieListComponent {
  readonly #movieService = inject(MovieService);

  searchField = new FormControl('');
  movies$ = toSignal(
    this.searchField.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap((searchTerm) => this.#movieService.getMovies(searchTerm || ''))
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
