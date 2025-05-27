import {Component, OnInit} from '@angular/core';
import {AppCookieService} from '../cookie.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-game',
  imports: [CommonModule],
  template: `
    <h1>Time to Gamble!</h1>
    <section class="slotMachine">
      <p>put a slot machine somewhere down here</p>
      <button (click)="spinSlotMachine()">Spin da wheel</button>
    </section>
    <section class="leaderboard">
      <p>put a leaderboard somewhere over here</p>
    </section>
  `,
  styles: []
})

export class GameComponent implements OnInit {
  title = 'Game';
  cookieValue: string = '';
  constructor(private cookieService: AppCookieService) { }
  async ngOnInit() {
    this.displayGameInfo()
  }

  displayGameInfo(){

  }

  spinSlotMachine() {

  }
  //When user goes to enter the game page:
    //They should only enter through a "join lobby" button on the lobby page
    //Pull up that lobby information and display it on this page
  //Constantly call to leaderboard to update
  //Call to game service whenever user spins to get and display result
}
