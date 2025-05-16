// cookie.service.ts
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root' // Makes it available app-wide
})
export class AppCookieService {
  private authState = new BehaviorSubject<boolean>(this.checkAuth());

  authState$ = this.authState.asObservable();

  constructor(private cookieService: CookieService) {}

  checkAuth(): boolean {
    try {
      return this.cookieService.check("user") && !!this.cookieService.get("user");
    } catch (e) {
      console.error('Cookie check failed:', e);
      return false;
    }
  }

  updateAuthState(): void {
    this.authState.next(this.checkAuth());
  }

  setCookie(key: string, value: string): void {
    this.cookieService.set(key, value);
  }

  getCookie(key: string): string {
    return this.cookieService.get(key);
  }

  deleteCookie(key: string): void {
    this.cookieService.delete(key);
  }

  checkCookieExists(key: string): boolean {
    return this.cookieService.check(key);
  }
}
