// import { HttpClient } from "@angular/common/http";
// import { Injectable } from "@angular/core";
// import * as moment from "moment";
// import { catchError, map } from "rxjs";
// import { User } from "../../models/user.model";
// import {JwtHelperService} from '@auth0/angular-jwt';

// @Injectable()
// export class AuthService {

//     constructor(private http: HttpClient) {

//     }

//     login(userName:string, password:string ) {
//         return this.http.post<User>('/api/login', {userName, password})
//         .pipe(map((response) => this.setSession(response)),
//             catchError((error) => blockUI ? this.handleError(error) : of([])));
//     }
          
//     private setSession(authResult: User) {
//         const expiresAt = moment().add(authResult.expiresIn,'second');

//         localStorage.setItem('token', authResult.token);
//         localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
//     }          

//     logout() {
//         localStorage.removeItem("id_token");
//         localStorage.removeItem("expires_at");
//     }

//     public isLoggedIn() {
//         return moment().isBefore(this.getExpiration());
//     }

//     isLoggedOut() {
//         return !this.isLoggedIn();
//     }

//     getExpiration() {
//         const expiration = localStorage.getItem("expires_at");
//         const expiresAt = JSON.parse(expiration);
//         return moment(expiresAt);
//     }    
// }