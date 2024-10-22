import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
} from '@angular/core';

const DEFAULT_FALLBACK_IMAGE = 'assets/noImage1.jpg';

@Directive({
  selector: 'img[ngmMovieImageFallback]',
  standalone: true,
})
export class MovieImageFallbackDirective {
  #el: HTMLImageElement = inject(ElementRef).nativeElement;

  ngmMovieImageFallback = input<string, string>(DEFAULT_FALLBACK_IMAGE, {
    transform: (value) => value || DEFAULT_FALLBACK_IMAGE,
  });

  @HostListener('error')
  setImage() {
    this.#el.src = this.ngmMovieImageFallback();
  }
}
