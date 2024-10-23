import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  inject,
  input,
} from '@angular/core';
import { AuthService, Role } from '../../services/auth.service';

@Directive({
  selector: '[ngmHasRole]',
  standalone: true,
})
export class HasRoleDirective {
  #template = inject(TemplateRef);
  #view = inject(ViewContainerRef);
  #authService = inject(AuthService);

  ngmHasRole = input<keyof typeof Role | undefined>(undefined);

  ngOnInit() {
    if (
      this.#authService.isAuthenticated() &&
      this.#authService.role() === this.ngmHasRole()
    ) {
      this.#view.createEmbeddedView(this.#template);
    } else {
      this.#view.clear();
    }
  }
}
