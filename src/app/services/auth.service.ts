import { Injectable, signal } from '@angular/core';
import { Observable, of, tap, throwError } from 'rxjs';

const MOCK_USER = {
  user: 'user',
  password: 'user',
};
const MOCK_ADMIN = {
  user: 'admin',
  password: 'admin',
};

const MOCK_TOKEN = '1234567890';

export const enum Role {
  User = 'User',
  Admin = 'Admin',
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #isAuthenticated = signal(false);
  #token = signal<string | undefined>(undefined);
  #role = signal<Role | undefined>(undefined);

  isAuthenticated = this.#isAuthenticated.asReadonly();
  token = this.#token.asReadonly();
  role = this.#role.asReadonly();

  login(user?: string, pass?: string): Observable<{ token: string }> {
    if (user === MOCK_USER.user && pass === MOCK_USER.password) {
      this.#isAuthenticated.set(true);
      this.#role.set(Role.User);
      return of({ token: MOCK_TOKEN }).pipe(
        tap(({ token }) => this.#token.set(token))
      );
    }
    if (user === MOCK_ADMIN.user && pass === MOCK_ADMIN.password) {
      this.#isAuthenticated.set(true);
      this.#role.set(Role.Admin);
      return of({ token: MOCK_TOKEN }).pipe(
        tap(({ token }) => this.#token.set(token))
      );
    }

    return throwError(() => 'Invalid user or password');
  }

  logout(): void {
    this.#isAuthenticated.set(false);
    this.#token.set(undefined);
    this.#role.set(undefined);
  }
}
