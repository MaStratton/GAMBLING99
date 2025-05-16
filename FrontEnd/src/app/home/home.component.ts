import { Component } from '@angular/core';
import {AppCookieService} from '../cookie.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  template: `
    <h1>Welcome to Gambling99!</h1>
    <p *ngIf="cookieValue == ''">Please Log in to continue</p>
    <p *ngIf="cookieValue != ''">Please select a lobby to play</p>
  `,
  styles: []
}) //Potentially add a button on the home page to join a random game


export class HomeComponent {
  title = 'Login';
  cookieValue: string = '';
  constructor(private cookieService: AppCookieService) { }
  ngOnInit() {
    this.getCookie();
  }

  getCookie() {
    this.cookieValue = this.cookieService.getCookie("user")
  }
}
