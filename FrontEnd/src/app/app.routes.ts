import { Routes } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {GameComponent} from './game/game.component';
import {SignUpComponent} from './signup/signup.component';
import {Component} from '@angular/core';
import {LobbyListComponent} from './lobbylist/lobbylist.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home',
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
  },
  {
    path: 'signup',
    component: SignUpComponent,
    title: 'Sign Up',
  },
  {
    path: 'game',
    component: GameComponent,
    title: 'Game',
  },
  {
    path: 'lobbies',
    component: LobbyListComponent,
    title: 'Lobbies',
  }
];
