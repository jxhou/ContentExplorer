import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as moment from 'moment';

import { share, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {

  }

  login(email:string, password:string ){
    return this.http.post('/api/signin', {email, password})
      .pipe(
          tap(res => this.setSession(res)),
          share(),
      );
  }

  signUp(firstName: string, lastName: string, email: string, password: string) {
    return this.http.post('/api/signup', {firstName, lastName,  email, password})
      .pipe(
          share(),
      );
  }

  private setSession(authResult) {
      const expiresAt = moment().add(authResult.expiresIn,'second');

      localStorage.setItem('id_token', authResult.idToken);
      localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
  }

  getToken() {
    return localStorage.getItem('id_token');
  }

  logout() {
      localStorage.removeItem("id_token");
      localStorage.removeItem("expires_at");
  }

  public isLoggedIn() {
      return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
      return !this.isLoggedIn();
  }

  getExpiration() {
      const expiration = localStorage.getItem("expires_at");
      const expiresAt = JSON.parse(expiration);
      return moment(expiresAt);
  }
}
