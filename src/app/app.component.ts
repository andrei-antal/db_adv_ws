import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MovieListComponent } from './movies/components/movie-list/movie-list.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'ngm-root',
  standalone: true,
  imports: [MovieListComponent, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  authService = inject(AuthService);
  #router = inject(Router);

  title = 'ngMovies';

  logout() {
    this.authService.logout();
    this.#router.navigate(['/']);
  }
}
