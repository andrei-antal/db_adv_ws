import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { GENRES } from '../model/movie-data';
import { MovieService } from './movie.service';
import { map, Observable } from 'rxjs';

export function genreValidator(
  formControl: AbstractControl
): ValidationErrors | null {
  return formControl.value &&
    formControl.value.reduce((acc: boolean, curr: string) => {
      return acc && GENRES.includes(curr.toLowerCase());
    }, true)
    ? null
    : { wrongGenre: true };
}

export const genreAsyncValidator =
  (genres$: Observable<string[]>) =>
  (formControl: AbstractControl): Observable<ValidationErrors | null> => {
    return genres$.pipe(
      map((genres) => {
        const movieGenres: string[] =
          formControl.value &&
          formControl.value.split(',').map((g: string) => g.trim());
        return movieGenres &&
          movieGenres.reduce((acc, curr) => {
            return acc && genres.includes(curr.toLowerCase());
          }, true)
          ? null
          : { wrongGenre: true };
      })
    );
  };

export const sciFiGenreYearValidator: ValidatorFn = (
  ctrl: AbstractControl
): ValidationErrors | null => {
  const genreCtrl = ctrl.get('genre');
  const yearCtrl = ctrl.get('year');
  if (!genreCtrl || !yearCtrl) {
    return null;
  }
  const hasSciFi = (genreCtrl.value as string[])
    .map((g) => g.trim().toLowerCase())
    .includes('science fiction');

  return hasSciFi && parseInt(yearCtrl.value, 10) < 1902
    ? { wrongSciFiYear: true }
    : null;
};
