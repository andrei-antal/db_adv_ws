import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import {
  Route,
  provideRouter,
  withComponentInputBinding,
} from '@angular/router';
import { HomeComponent } from './home/home.component';
import { isAuthenticatedGuard } from './guards/is-authenticated.guard';

const routes: Route[] = [
  { path: '', component: HomeComponent },
  {
    path: 'movies',
    canActivate: [isAuthenticatedGuard],
    loadChildren: () =>
      import('./movies/movies.routes').then((m) => m.movieRoutes),
  },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes, withComponentInputBinding()),
  ],
};
