import { Component } from '@angular/core';
import {AppComponent} from '../app.component';
import {AppCookieService} from '../cookie.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  imports: [],
  template: `
    <section class="container justify-content-center align-items-center min-vh-100" style="width:100%; max-width: 400px;">
      <form class="form-control-sm mt-5 bg-gradient">
        <h2>Please sign in</h2>
        <p id="message" class="text-danger"></p>
        <div class="form-group mb-2">
          <label>Email</label> <br>
          <input type="email" class="form-control" placeholder="Email" #email/> <br>
        </div>
        <div class="form-group mb-2">
          <label>Password</label> <br>
          <input type="password" class="form-control mb-2" placeholder="Password" #password/> <br>
        </div>
        <button class="btn btn-primary mb2 w-100" type="button" (click)="attemptLogin(email.value, password.value)">Login</button>
      </form>
    </section>
  `,
  styles: []
})

export class LoginComponent {
  title = 'Login';
  constructor(private cookieService: AppCookieService, private router: Router) { }

  async attemptLogin(email: string, password: string) {
    if(email != null && password != null){
      const request = {
        "Email": email,
        "Password": password
      }
      await fetch('http://localhost:8080/auth', {
        body: JSON.stringify(request),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST'
      }).then(r => {
        if (r.ok) {return r.text()}
        else return null;
      }).then(r => {
        if(r == null){
          let element = document.getElementById('message');
          if(element) {
            element.textContent = "Invalid login credentials."
          }
          this.router.navigate(['/login']);
        }else {
          this.cookieService.setCookie("user" , r);
          this.cookieService.updateAuthState();
          this.router.navigate(['/']);
        }
      })
    }
  }
}
