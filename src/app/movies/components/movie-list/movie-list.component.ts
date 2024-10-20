import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CommentUpdate } from '../movie-item/movie-item.component';
import { MovieService } from '../../services/movie.service';
import { debounceTime, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'ngm-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieListComponent {
  readonly #movieService = inject(MovieService);

  searchField = new FormControl('');
  movies$ = this.searchField.valueChanges.pipe(
    startWith(''),
    debounceTime(300),
    switchMap((searchTerm) => this.#movieService.getMovies(searchTerm || ''))
  );

  trackByFn(_: any, movie: any): number {
    return movie.id;
  }

  handleCommentUpdate(commentPayload: CommentUpdate): void {
    this.#movieService
      .updateComment(commentPayload.id, commentPayload.newComment)
      .subscribe();
  }

  handleMovieDelete(movieId: string): void {
    this.#movieService.deleteMovie(movieId).subscribe();
  }
}
