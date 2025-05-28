import { Component } from '@angular/core';
import {AppCookieService} from '../cookie.service';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [CommonModule],
  template: `
    <section>
      <form>
        <h1>Please enter the following to sign up</h1>
        <p id="message"></p>
        <input type="text" placeholder="Username" #username/> <br>
        <input type="email" placeholder="Email" #email/> <br>
        <input type="password" placeholder="Password" #password/> <br>
        <button class="primary" type="button" (click)="attemptSignup(username.value, email.value, password.value)">Sign up</button>
      </form>
    </section>
  `,
  styles: []
})

export class SignUpComponent {
  title = 'Sign Up';
  constructor(private router: Router) {}
  async attemptSignup(username: string, email: string, password: string){
    if(username != null && email != null && password != null){
      const request = {
        "Username": username,
        "Email": email,
        "Password": password
      }
      await fetch('http://localhost:8081/user', {
        body: JSON.stringify(request),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST'
      }).then(r => {
        if (r.ok) {return r.json()}
        else return null;
      }).then(r => {
        if(r == null){
          console.log("signup redirect");
          const element = document.getElementById('message');
          if(element) {
            element.textContent = "Please check your email address and username";
          }
          this.router.navigate(['/signup']);
        }else {
          console.log("login redirect");
          this.router.navigate(['/login']);
        }
      })
    }
  }
}
