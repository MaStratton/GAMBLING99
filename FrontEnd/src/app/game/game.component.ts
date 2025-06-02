import {Component, OnInit} from '@angular/core';
import {AppCookieService} from '../cookie.service';
import {CommonModule} from '@angular/common';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-game',
  imports: [CommonModule],
  template: `
    <h1>Time to Gamble!</h1>
    <section class="slotMachine">
      <p>put a slot machine somewhere down here</p>
      <p id="response"></p>
      <p id="money"></p>
      <button (click)="spinSlotMachine()">Spin da wheel</button>
    </section>
    <section class="leaderboard">
      <p>put a leaderboard somewhere over here
      <div *ngIf="leaderboard != undefined">
        <p
          *ngFor="let player of leaderboard"
        >{{player.position}}) {{player.user_id}} - \${{player.money}}</p>
      </div>
    </section>
  `,
  styles: []
})

export class GameComponent implements OnInit {
  title = 'Game';
  id: any;
  userId: any;
  cookieValue: string = '';
  leaderboard: any = [];
  constructor(private cookieService: AppCookieService, private route: ActivatedRoute) { }
  async ngOnInit() {
    this.cookieValue = this.cookieService.getCookie("user")
    this.userId = this.parseJwt(this.cookieValue)["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
    this.route.params.subscribe(params => {
      this.id = params['id'];
    })
    await this.updateLeaderboard()
  }

  async updateLeaderboard(){
    await fetch(`http://localhost:8080/lobby/${this.id}/leaderboard`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.cookieValue
      },
      method: 'GET'
    }).then(r => {
      if (r.ok) {return r.json()}
      else return null;
    }).then(r => {
      if (r != undefined) {
        this.leaderboard = r;
      }
    })
  }

  async spinSlotMachine() {
    await fetch(`http://localhost:8080/game`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.cookieValue
      },
      method: 'GET'
    }).then(r => {
      if (r.ok) {return r.json()}
      else return null;
    }).then(r => {
      if (r != undefined) {
        console.log(r);
        let element = document.getElementById('');
        if(element) {
          element.textContent = "Invalid login credentials."
        }
      }
    })
    this.updateLeaderboard()
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
