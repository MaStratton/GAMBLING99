import {Component, OnInit} from '@angular/core';
import {AppCookieService} from '../cookie.service';
import {CommonModule} from '@angular/common';
import {ActivatedRoute} from '@angular/router';

type slotTuple = readonly [string, string];

@Component({
  selector: 'app-game',
  imports: [CommonModule],
  template: `
    <h1>Time to Gamble!</h1>
    <section class="slotMachine">
      <div class="wheel" *ngFor="let wheel of wheels; let i = index">
        <img
            *ngIf="currentImages[i][0]"
            [src]="currentImages[i][0]"
            [alt]="currentImages[i][1]"
            [class.spinning]="isSpinning[i]"
        />
      </div>
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

  slotImages:slotTuple[] = [['FrontEnd/src/Images/cherry.png','Bar'],
    ['FrontEnd/src/Images/lemon.png', 'Lemon'],
    ['FrontEnd/src/Images/orange.png', 'Orange'],
    ['FrontEnd/src/Images/plum.png', 'Plum'],
    ['FrontEnd/src/Images/bell.png', 'Bell'],
    ['FrontEnd/src/Images/BAR.png', 'Bar'],
    ['FrontEnd/src/Images/unicorn7.png', 'Seven'],
    ['FrontEnd/src/Images/grapes.png', 'Grape'],
    ['FrontEnd/src/Images/melon.png', 'Melon'],
    ['FrontEnd/src/Images/star.png', 'Star'],
    ['FrontEnd/src/Images/diamond.png', 'Diamond'],
    ['FrontEnd/src/Images/penguin.png', 'Penguin'],
    ['FrontEnd/src/Images/clover.png', 'Clover'],
    ['FrontEnd/src/Images/Heart.png', 'Heart'],
    ['FrontEnd/src/Images/skull.png', 'Skull']
  ];

  wheels = [0, 1, 2];
  currentImages: slotTuple[] = [['', ''], ['', ''], ['', '']];
  isSpinning: boolean[] = [false, false, false];

  constructor(private cookieService: AppCookieService, private route: ActivatedRoute) { }
  async ngOnInit() {
    this.cookieValue = this.cookieService.getCookie("user")
    this.userId = this.parseJwt(this.cookieValue)["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
    this.route.params.subscribe(params => {
      this.id = params['id'];
    })
    await this.updateLeaderboard()
    await this.updateMoney()
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
        this.slotSpinAnimation(r[0], r[1], r[2]);
        let element = document.getElementById('response');
        if(element) {
          element.textContent = `${r}`
        }
      }
    })
    await this.updateLeaderboard()
    await this.updateMoney()
  }

  async updateMoney(){
    await fetch(`http://localhost:8080/lobby/${this.userId}/money`, {
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
        let element = document.getElementById('money');
        if(element) {
          element.textContent = `Current Balance: \$${r.money}`
        }
      }
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

  slotSpinAnimation(wheel1:string, wheel2:string, wheel3:string) {

    let WheelResult: string[] = [wheel1, wheel2, wheel3] //results get sent in here

    this.wheels.forEach((wheel, i) => {
      this.isSpinning[wheel] = true;
      let index = 0;
      let delay = i*500
      let animationInterval = 150;

      setTimeout(() => {
        const spinInterval = setInterval(() => {
          this.currentImages[wheel] = this.slotImages[index];
          if (this.slotImages[index][1] === WheelResult[wheel]) {
            clearInterval(spinInterval);
            this.isSpinning[i] = false;
            return;
          }
          index = (index + 1) % this.slotImages.length;
        }, animationInterval);
      }, delay);
    })
    // images:tuple [string, string]
    // iterate through the tuple of images for the wheels in a for loop
    // insert each image with an animation
    // if the image is the one that is selected from the wheel
    // stop animation
    // if not
    // remove the image with an animation and continue on
  }
  }
