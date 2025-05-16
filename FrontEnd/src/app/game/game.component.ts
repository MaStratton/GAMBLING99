import { Component } from '@angular/core';
import {AppCookieService} from '../cookie.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-game',
  imports: [CommonModule],
  template: `
    <h1>Something something blah blah</h1>
    <p>put a slot machine somewhere down here</p>
    <p>put a leaderboard somewhere over here</p>
    <button>Spin da wheel</button>
  `,
  styles: []
})

export class GameComponent {
  title = 'Game';
  cookieValue: string = '';
  constructor(private cookieService: AppCookieService) { }
  //When user goes to enter the game page:
    //Make a call to the backend to find open lobbies
    //Pick a lobby to put the user into
    //Pull up that lobby information and display it on this page
  //Constantly call to leaderboard to update
  //Call to game service whenever user spins to get and display result
}
