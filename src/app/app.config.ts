import { ApplicationConfig, isDevMode } from '@angular/core';
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
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';
import * as MoviesEffects from './movies/store/movies.effects';

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
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideEffects(MoviesEffects),
  ],
};
