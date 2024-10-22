import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

type Genres = {
  action: boolean;
  adventure: boolean;
  comedy: boolean;
  crime: boolean;
  drama: boolean;
  fantasy: boolean;
  historical: boolean;
  horror: boolean;
  mystery: boolean;
  romance: boolean;
  satire: boolean;
  'science fiction': boolean;
  thriller: boolean;
  western: boolean;
};

@Component({
  selector: 'ngm-genre-control',
  standalone: true,
  imports: [KeyValuePipe],
  templateUrl: './genre-control.component.html',
  styleUrl: './genre-control.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: GenreControlComponent,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenreControlComponent implements ControlValueAccessor {
  #cdr = inject(ChangeDetectorRef);
  genres = signal<Genres>({
    action: false,
    adventure: false,
    comedy: false,
    crime: false,
    drama: false,
    fantasy: false,
    historical: false,
    horror: false,
    mystery: false,
    romance: false,
    satire: false,
    'science fiction': false,
    thriller: false,
    western: false,
  });

  onChange!: (genres: string) => {};

  onTouched!: () => {};

  #touched = false;

  // ControlValueAccessor implementation
  writeValue(obj: string): void {
    const newGenres = obj
      .split(', ')
      .map((g) => g.toLowerCase())
      .filter((g) => g)
      .reduce((acc, curr) => {
        acc[curr as keyof Genres] = true;
        return acc;
      }, this.genres());
    this.genres.set(newGenres);
    this.#cdr.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  toggleGenre(genreKey: string): void {
    const key = genreKey as keyof Genres;
    this.genres.set({
      ...this.genres(),
      [key]: !this.genres()[key],
    });

    const genres = [];
    for (const [genre, isSelected] of Object.entries(this.genres())) {
      if (isSelected) {
        genres.push(genre);
      }
    }

    this.onChange(genres.join(', '));

    if (!this.#touched) {
      this.#touched = true;
      this.onTouched();
    }
  }
}
