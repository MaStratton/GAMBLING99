import { Component } from '@angular/core';
import {AppComponent} from '../app.component';
import {AppCookieService} from '../cookie.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  imports: [],
  template: `
    <section>
      <form>
        <input type="text" placeholder="Username" #username/> <br>
        <input type="password" placeholder="Password" #password/> <br>
        <button class="primary" type="button" (click)="attemptLogin(username.value, password.value)">Login</button>
      </form>
    </section>
  `,
  styles: []
})

export class LoginComponent {
  title = 'Login';
  constructor(private cookieService: AppCookieService, private router: Router) { }

  attemptLogin(username: string, password: string) {

    this.cookieService.setCookie("user", username);
    this.cookieService.updateAuthState();
    this.router.navigate(['/']);
  }
}
