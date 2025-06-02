import {Component, OnInit} from '@angular/core';
import {AppCookieService} from '../cookie.service';
import {CommonModule} from '@angular/common';
import {AppComponent} from '../app.component';
import {LobbyComponent} from '../lobby/lobby.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-lobbylist',
  imports: [CommonModule, LobbyComponent],
  template: `

    <section class="lobbyList">
      <div class="text-center">
        <h1>Something something blah blah</h1>
        <p
          *ngIf="inLobby"
        >Please your lobby before joining another</p>
        <div class="container">
          <div class="text-center row">
            <app-lobby
              class="col-4"
              *ngFor="let lobby of lobbies"
              [lobby]="lobby"
              [inLobby]="inLobby"
              [lobbyUserIsIn]="lobbyUserIsIn"
            ></app-lobby>
          </div>
        </div>
      </div>
    </section>
    <section *ngIf="role === 'ADMIN'" class="createLobby">
      <div class="d-flex justify-content-center">
        <div class="text-center">
          <button (click)="createLobby()" class="btn btn-danger">Create a new Lobby</button>
        </div>
      </div>
    </section>
  `,
  styles: []
})

export class LobbyListComponent implements OnInit {
  title = 'Lobby List';
  cookieValue: string = '';
  jwtPayload: any;
  role: any;
  inLobby: boolean = false;
  userId: any;
  lobbyUserIsIn: any;

  lobbies = [];

  constructor(private cookieService: AppCookieService, private router: Router) { }
  async ngOnInit() {
    this.cookieValue = this.cookieService.getCookie("user")
    this.jwtPayload = this.parseJwt(this.cookieValue)
    this.role = this.jwtPayload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
    this.userId = this.jwtPayload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
    await this.getLobbyList()
    await this.checkLobbyStatus()
    //console.log("jwtPayload", this.jwtPayload)
    //console.log("Role", this.role)
  }

  async createLobby() {
    const authorization = `Bearer ${this.cookieValue}`
    const request = {
      "name": "placeholder",
      "host": "placeholder"
    }
    await fetch('http://localhost:8084/lobby/create', {
      body: JSON.stringify(request),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authorization,
      }
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

  async getLobbyList() {
    await fetch('http://localhost:8080/lobby', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET'
    }).then(r => {
      if (r.ok) {return r.json()}
      else return null;
    }).then(r => {
      //console.log("Fetch Body: ", r.lobbies);
      this.lobbies = r.lobbies;
    })
  }

  async checkLobbyStatus(){
    await fetch(`http://localhost:8080/lobby/${this.userId}/money`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.cookieValue}`
      },
      method: 'GET'
    }).then(r => {
      if (r.ok) {
        this.inLobby = true;
        return r.json()
      }
      else return null;
    }).then(r => {
      if (r != null){
        this.lobbyUserIsIn = r.lobby_id
      }
    })
    //console.log(this.userId, this.inLobby);
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
