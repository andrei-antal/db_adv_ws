import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'ngm-home',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  #fb = inject(NonNullableFormBuilder);
  #router = inject(Router);
  authService = inject(AuthService);
  error = signal<string | undefined>(undefined);

  loginForm = this.#fb.group({
    user: [''],
    password: [''],
  });

  submit() {
    const { user, password } = this.loginForm.value;
    this.authService.login(user, password).subscribe({
      next: () => {
        this.error.set(undefined);
        this.#router.navigate(['/movies']);
      },
      error: (err) => {
        this.error.set(err);
      },
    });
  }
}
