import { Component } from '@angular/core';
import {AppCookieService} from '../cookie.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-signup',
  imports: [CommonModule],
  template: `
    <h1>Something something blah blah</h1>
    <p>put username input here</p>
    <p>put email input here</p>
    <p>put password input here</p>
    <button>Sign up</button>
  `,
  styles: []
})

export class SignUpComponent {
  title = 'Sign Up';
}
