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
        <h1>Please sign in</h1>
        <p id="message"></p>
        <input type="text" placeholder="Username" #username/> <br>
        <input type="email" placeholder="Email" #email/> <br>
        <input type="password" placeholder="Password" #password/> <br>
        <button class="primary" type="button" (click)="attemptLogin(username.value, email.value, password.value)">Login</button>
      </form>
    </section>
  `,
  styles: []
})

export class LoginComponent {
  title = 'Login';
  constructor(private cookieService: AppCookieService, private router: Router) { }

  async attemptLogin(username: string, email: string, password: string) {
    if(username != null && email != null && password != null){
      const request = {
        "Username": username,
        "Email": email,
        "Password": password
      }
      await fetch('http://localhost:8082/auth', {
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
          console.log(r)
          this.cookieService.setCookie("user" , r);
          this.cookieService.updateAuthState();
          this.router.navigate(['/']);
        }
      })
    }
  }
}
