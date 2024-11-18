import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BookService } from './book.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  loggedIn = false;
  private userSubject = new BehaviorSubject<boolean>(this.loggedIn);
  user$ = this.userSubject.asObservable();
  router = inject(Router);

  // Replace with your Firebase API key
  private firebaseAuthUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDuM3RSW2cYftlom8mSbAG2MaCZjTcIx5o`;
  private signInUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDuM3RSW2cYftlom8mSbAG2MaCZjTcIx5o`;

  constructor(private http: HttpClient, private bookService: BookService) {}

  logIn() {
    this.loggedIn = true;
    this.router.navigate(['/books-read']);
    this.userSubject.next(this.loggedIn);
  }

  logOut() {
    localStorage.removeItem('idToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('localId');
    localStorage.removeItem('email');

    this.loggedIn = false;
    this.userSubject.next(this.loggedIn);

    this.bookService.clearbooks();

    console.log('User logged out successfully.');
  }

  signUp(email: string, password: string) {
    const payload = {
      email,
      password,
      returnSecureToken: true,
    };
    this.loggedIn = true;
    this.userSubject.next(this.loggedIn);
    return this.http.post<any>(this.firebaseAuthUrl, payload).subscribe(
      (response) => {
        localStorage.setItem('idToken', response.idToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('localId', response.localId);
        localStorage.setItem('email', response.email);

        this.logIn();
        console.log('User signed up successfully:', response);
      },
      (error) => {
        console.error('Error during signup:', error);
      }
    );
  }

  logInUser(email: string, password: string) {
    const payload = {
      email,
      password,
      returnSecureToken: true,
    };

    return this.http.post<any>(this.signInUrl, payload).subscribe(
      (response) => {
        localStorage.setItem('idToken', response.idToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('localId', response.localId);
        localStorage.setItem('email', response.email);

        this.logIn();
        console.log('User logged in successfully:', response);
      },
      (error) => {
        console.error('Error during login:', error);
      }
    );
  }
}
