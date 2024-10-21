import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieItemComponent } from './movie-item.component';
import { EMPTY_MOVIE } from '../../model/movie';
import { FormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';

describe('MovieItemComponent', () => {
  let component: MovieItemComponent;
  let fixture: ComponentFixture<MovieItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MovieItemComponent, FormsModule],
      providers: [provideRouter([])],
    });
    fixture = TestBed.createComponent(MovieItemComponent);
    component = fixture.componentInstance;
    component.movie = EMPTY_MOVIE;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
