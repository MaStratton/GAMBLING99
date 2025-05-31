import {Component, Input, input, OnInit} from '@angular/core';
import {AppCookieService} from '../cookie.service';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-lobby',
  imports: [CommonModule, NgOptimizedImage],
  template: `
    <div class="form-control-lg bg-black bg-opacity-25 m-1 p-3">
      <p>Lobby ID: {{ lobby }}</p>
      <p>Player Count: {{playerCount}}</p>
      <button
        (click)="joinLobby()"
        class="btn btn-primary"
        *ngIf="!inLobby"
      >Join Lobby</button>
      <button
        (click)="leaveLobby()"
        class="btn btn-danger"
        *ngIf="inLobby && lobbyUserIsIn == lobby"
        >Leave Lobby
      </button>
    </div>
  `,
  styles: []
}) //Potentially add a button on the home page to join a random game


export class LobbyComponent implements OnInit {
  @Input() lobby!: string;
  @Input() inLobby!: boolean;
  @Input() lobbyUserIsIn!: any;
  cookieValue: string = '';
  jwtPayload: any;
  playerCount = 0;
  userId: any;

  constructor(private cookieService: AppCookieService, private router: Router) { }

  async ngOnInit() {
    this.cookieValue = this.cookieService.getCookie("user")
    this.jwtPayload = this.parseJwt(this.cookieValue)
    this.userId = this.jwtPayload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
    await this.getLobbyInfo()
  }

  async getLobbyInfo() {
    await fetch(`http://localhost:8084/lobby/${this.lobby}/leaderboard`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET'
    }).then(r => {
      if (r.ok) {return r.json()}
      else return null;
    }).then(r => {
      //console.log(this.lobby, 'leaderboard', r);
      if (r != undefined) {
        this.playerCount = r.length;
      }
    })
  }

  async joinLobby() {
    const request = {
      "user_id": this.userId,
      "lobby_id": this.lobby,
      "initial_money": 5000
    }
    console.log(request);
    await fetch('http://localhost:8084/lobby/join', {
      body: JSON.stringify(request),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.cookieValue}`,
      },
      method: 'POST'
    }).then(r => {
      if (r.ok) {return r.json()}
      else return null;
    }).then(r => {
      //this.router.navigate(['/game'])
    })
    //TODO: Add notification of user already in lobby
    //Also update to send to correct game page.
  }

  async leaveLobby() {
    const request = {
      "user_id": this.userId
    }
    await fetch(`http://localhost:8084/lobby/leave`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.cookieValue}`,
      },
      body: JSON.stringify(request),
      method: 'POST'
    }).then(r => {
      if (r.ok) {return r.json()}
      else return null;
    }).then(r => {
      let currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      })
    })
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
