import {Component, OnInit} from '@angular/core';
import {AppCookieService} from '../cookie.service';
import {CommonModule} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {waitForAsync} from '@angular/core/testing';

type slotTuple = readonly [string, string];

@Component({
  selector: 'app-game',
  imports: [CommonModule],
  template: `
    <div class="text-center">
      <h1>Time to Gamble!</h1>
      <section class="">
        <div class="d-flex justify-content-center gap-2 mt-4 mb-5">
          <div class="wheel bg-white bg-opacity-25" *ngFor="let wheel of wheels; let i = index">
            <img
                *ngIf="currentImages[i][0]"
                [src]="currentImages[i][0]"
                [alt]="currentImages[i][1]"
                [class.spinning]="isSpinning[i]"
            />
          </div>
        </div>
        <p id="money"></p>
        <button (click)="spinSlotMachine()" class="btn btn-success w-25">Spin wheel</button>
      </section>
      <section class="container justify-content-center align-items-center min-vh-100" style="width:100%; max-width: 400px;">
        <div class="bg-black bg-opacity-25 rounded-2 mt-5">
          <p>Leaderboard:
          <div *ngIf="leaderboard != undefined">
            <p
              *ngFor="let player of leaderboard"
            >{{player.position}}) {{player.user_id}} - \${{player.money}}</p>
          </div>
        </div>
      </section>
    </div>
  `,
  styleUrls: ['./game.component.css'],
})

export class GameComponent implements OnInit {
  title = 'Game';
  id: any;
  userId: any;
  cookieValue: string = '';
  leaderboard: any = [];

  slotImages:slotTuple[] = [
    ['../../images/lemon.png', 'Lemon'],
    ['../../images/orange.png', 'Orange'],
    ['../../images/plum.png', 'Plum'],
    ['../../images/bell.png', 'Bell'],
    ['../../images/BAR.png', 'Bar'],
    ['../../images/unicorn7.png', 'Seven'],
    ['../../images/grapes.png', 'Grape'],
    ['../../images/melon.png', 'Melon'],
    ['../../images/star.png', 'Star'],
    ['../../images/diamond.png', 'Diamond'],
    ['../../images/penguin.png', 'Penguin'],
    ['../../images/clover.png', 'Clover'],
    ['../../images/Heart.png', 'Heart'],
    ['../../images/cherry.png', 'Cherry'],
    ['../../images/skull.png', 'Skull']
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
    await this.displayLeaderboard()

    await this.updateMoney()
  }

  async displayLeaderboard() {
    await this.updateLeaderboard()
    await this.editLeaderboard()
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

  async editLeaderboard() {
    for (let player of this.leaderboard) {
      player.user_id = await this.userIdToUsername(player.user_id);
    }
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
        let element = document.getElementById('money');
        if(element) {
          element.textContent = `Current Balance: \$${r.money}`
        }
      }
    })
  }

  leaderBoardInterval = setInterval(() => {
    //this.updateLeaderboard()
  }, 1000)

  async userIdToUsername(userid: string): Promise<string> {
    let username = "";
    await fetch(`http://localhost:8080/user/${userid}`, {
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
        username = r.username;
      }
    })
    return username;
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

  protected readonly waitForAsync = waitForAsync;
}
