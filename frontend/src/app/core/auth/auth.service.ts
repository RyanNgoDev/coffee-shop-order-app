import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, throwError } from 'rxjs';
import { User } from 'src/models/user.model';
import * as dayjs from 'dayjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BlockUIService } from '../services/block-ui.service';

@Injectable({providedIn: 'root'})
export class AuthService {
  public loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public user: BehaviorSubject<User> = new BehaviorSubject<User>({} as User);

  get isLoggedIn() {
    const expirationTime = this.getExpiration();
    if (expirationTime && dayjs().isBefore(expirationTime)) {
      this.loggedIn.next(true);
    }

    return this.loggedIn.asObservable();
  }

  get currentUser() {
    return this.user.asObservable();
  }

  constructor(
    private router: Router,
    private http: HttpClient,
    private blockUIService: BlockUIService,
  ) {}

  // login(user: User) { // used for DEV
  //   if (user.userName !== '' && user.password !== '' ) {
  //     user.token = 'aniaHASIUDHAa7*g(SHA9dsgafasd9*UD(SHAD';
  //     user.expiresIn = 2;
  //     this.setSession(user);
  //     this.loggedIn.next(true);
  //     this.router.navigate(['/']);
  //   }
  // }

  login(user: User) {
    this.blockUIService.startBlock(true);
    return this.http.post<User>('http://chiu.com/server/user/authenticate', user)
      .pipe(map((response) => {
        this.blockUIService.stopBlock();
        this.user.next(response);
        return response;
    }), catchError((err: HttpErrorResponse) => {
      return throwError(() => err.error);
    }));
  }

  logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    this.loggedIn.next(false);
    this.user.next({} as User);
    this.router.navigate(['/login']);
  }
        
  public setSession(authResult: User) {
      const expiresAt = dayjs().add(authResult.expiresIn, 'hour');

      localStorage.setItem('id_token', authResult.token);
      localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
  }          

  getExpiration() {
    const expiration = localStorage.getItem("expires_at");
    if (expiration) {
      const expiresAt = JSON.parse(expiration);
      return dayjs(expiresAt);
    }

    return null;
  }    
}