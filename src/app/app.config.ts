import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  Route,
  provideRouter,
  withComponentInputBinding,
} from '@angular/router';
import { HomeComponent } from './home/home.component';
import { isAuthenticatedGuard } from './guards/is-authenticated.guard';
import { authInterceptor } from './interceptors/auth.interceptor';
import { provideStore } from '@ngrx/store';
import { moviesListReducer } from './movies/store/movies.reducers';

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
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(routes, withComponentInputBinding()),
    provideStore({ moviesFeature: moviesListReducer }),
  ],
};
