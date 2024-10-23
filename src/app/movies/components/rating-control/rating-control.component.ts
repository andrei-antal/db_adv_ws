import { ChangeDetectionStrategy, Component, model } from '@angular/core';

@Component({
  selector: 'ngm-rating-control',
  standalone: true,
  template: `
    @for (state of [1,2,3,4,5]; track $index) {
    <i
      role="button"
      class="fa-solid fa-star"
      [class.filled-star]="state <= rating()"
      (click)="rating.set($index + 1)"
    ></i>
    }
  `,
  styles: `
    :host {
      display: flex;
      gap: .25rem;

      .filled-star {
        color: orangered;
      }

      i {
        cursor: pointer;
        user-select: none;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingControlComponent {
  rating = model<number>(0);
}
