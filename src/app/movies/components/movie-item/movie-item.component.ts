import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { EMPTY_MOVIE, Movie } from '../../model/movie';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { WordCountPipe } from '../../../pipes/word-count.pipe';

export interface CommentUpdate {
  id: string;
  newComment: string;
}

@Component({
  selector: 'ngm-movie-item',
  standalone: true,
  imports: [FormsModule, RouterModule, WordCountPipe],
  templateUrl: './movie-item.component.html',
  styleUrls: ['./movie-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieItemComponent {
  movie = input.required<Movie>();
  editable = input(true);

  commentUpdate = output<CommentUpdate>();
  movieDelete = output<string>();

  state = computed(() => {
    const movie = this.movie();
    return {
      movieComment: signal(movie.comment),
      commentSaved: signal(movie.comment.length > 0),
    };
  });

  saveComment(): void {
    if (!this.state().commentSaved()) {
      this.commentUpdate.emit({
        id: this.movie()?.id || '',
        newComment: this.state().movieComment(),
      });
    } else {
      this.state().commentSaved.set(false);
    }
  }

  clearComment(): void {
    this.commentUpdate.emit({
      id: this.movie().id,
      newComment: '',
    });
  }
}
