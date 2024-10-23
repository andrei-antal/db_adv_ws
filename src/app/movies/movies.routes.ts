import { Route } from '@angular/router';
import { Role } from '../services/auth.service';
import { MovieDetailComponent } from './components/movie-detail/movie-detail.component';
import { hasRoleGuard } from '../guards/has-role.guard';

export const movieRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./components/movie-list/movie-list.component').then(
        (c) => c.MovieListComponent
      ),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./components/movie-detail/movie-detail.component').then(
        (c) => c.MovieDetailComponent
      ),
    data: {
      roles: [Role.Admin],
    },
    canActivate: [hasRoleGuard],
    canDeactivate: [
      (component: MovieDetailComponent) => component.confirmCancel(),
    ],
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./components/movie-detail/movie-detail.component').then(
        (c) => c.MovieDetailComponent
      ),
    data: {
      roles: [Role.Admin],
    },
    canActivate: [hasRoleGuard],
    canDeactivate: [
      (component: MovieDetailComponent) => component.confirmCancel(),
    ],
  },
];
