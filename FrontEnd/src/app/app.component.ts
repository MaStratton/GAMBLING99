import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from '@angular/router';
import {AppCookieService} from './cookie.service';
import {NgbNav, NgbNavItem, NgbNavLinkBase} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, RouterOutlet, RouterLink, NgbNav, NgbNavLinkBase, NgbNavItem],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

//---------Add sign up page?-------------
//Username, email, password
export class AppComponent implements OnInit {
  loggedIn = false;
  cookieValue: string = '';
  title = 'SlotMachineFrontEnd';
  constructor(private cookieService: AppCookieService, public route: ActivatedRoute, private router: Router) { }
  ngOnInit() {
    this.getCookie();
    this.cookieService.authState$.subscribe(authState => {
      this.loggedIn = authState;
      this.getCookie();
    })
  }

  getCookie() {
    this.cookieValue = this.cookieService.getCookie("user")
    if (this.cookieValue != '') { this.loggedIn = true; }
  }

  deleteCookie() {
    this.cookieService.deleteCookie("user")
  }

  logOut() {
    this.deleteCookie();
    this.cookieService.updateAuthState()
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    })
  }
}
