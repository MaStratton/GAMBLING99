import {Component, OnInit} from '@angular/core';
import {AppCookieService} from '../cookie.service';
import {CommonModule} from '@angular/common';
import {AppComponent} from '../app.component';

@Component({
  selector: 'app-lobbylist',
  imports: [CommonModule],
  template: `

    <section class="lobbyList">
      <h1>Something something blah blah</h1>
      <p>a square with lobby info</p>
      <button (click)="joinLobby()">Join Lobby</button>
    </section>
    <section *ngIf="jwtPayload.UserId == 8" class="createLobby">
      <p>Create a Lobby</p>
      <button>Hello</button>
    </section>
  `,
  styles: []
})

export class LobbyListComponent implements OnInit {
  title = 'Lobby List';
  cookieValue: string = '';
  jwtPayload: any;

  constructor(private cookieService: AppCookieService) { }
  async ngOnInit() {
    this.cookieValue = this.cookieService.getCookie("user")
    this.jwtPayload = this.parseJwt(this.cookieValue)
    console.log("jwtPayload", this.jwtPayload)
  }

  joinLobby() {

  }

  createLobby() {

  }

  parseJwt(token : string) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }
}
