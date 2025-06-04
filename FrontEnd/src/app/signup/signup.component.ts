import { Component } from '@angular/core';
import {AppCookieService} from '../cookie.service';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [CommonModule],
  template: `
    <section class="container justify-content-center align-items-center min-vh-100" style="width:100%; max-width: 400px;">
      <form class="form-control-sm mt-5 bg-gradient">
          <h3>Please enter the following to sign up</h3>
          <p id="message" class="text-danger"></p>
        <div class="mb-2">
          <label for="InputUsername">Username</label> <br>
          <input type="text" class="form-control" placeholder="Username" #username/> <br>
        </div>
        <div class="form-group mb-2">
          <label>Email</label> <br>
          <input type="email" class="form-control" placeholder="Email" #email/> <br>
        </div>
        <div class="form-group mb-2">
          <label>Password</label> <br>
          <input type="password" class="form-control" placeholder="Password" #password/> <br>
        </div>
        <div class="form-group form-check mb-2">
          <input type="checkbox" class="form-check-input" id="exampleCheck1" #termsOfService>
          <label class="form-check-label" for="exampleCheck1">Agree to our terms of service</label>
        </div>
        <button class="btn btn-primary mb2 w-100" type="button" (click)="attemptSignup(username.value, email.value, password.value, termsOfService.checked)">Sign up</button>
      </form>
    </section>
  `,
  styles: []
})

export class SignUpComponent {
  title = 'Sign Up';
  constructor(private router: Router) {}
  async attemptSignup(username: string, email: string, password: string, acceptedTOS: boolean) {
    if(username != null && email != null && password != null && acceptedTOS){
      const request = {
        "Username": username,
        "Email": email,
        "Password": password
      }
      await fetch('http://localhost:8080/user', {
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
          const element = document.getElementById('message');
          if(element) {
            element.textContent = "Please check your email address and username";
          }
          this.router.navigate(['/signup']);
        }else {
          this.router.navigate(['/login']);
        }
      })
    }
    const element = document.getElementById('message');
    if(!acceptedTOS){
      if(element) element.textContent = "Please accept the terms of service";
    } else {
      if (element) element.textContent = "Please fill out all forms";
    }
  }
}
