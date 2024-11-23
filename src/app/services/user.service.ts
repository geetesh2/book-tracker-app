import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BookService } from './book.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  loggedIn = false;
  private userSubject = new BehaviorSubject<boolean>(this.loggedIn);
  user$ = this.userSubject.asObservable();
  router = inject(Router);

  constructor(private http: HttpClient, private bookService: BookService) {
    this.restoreLogin(); // Check and restore login state on service initialization
  }

  private restoreLogin() {
    const idToken = localStorage.getItem('idToken');
    const localId = localStorage.getItem('localId');

    if (idToken && localId) {
      this.loggedIn = true;
      this.userSubject.next(this.loggedIn);
      this.bookService.fetchBooks(); // Fetch user's books on restore
    }
  }

  logIn() {
    this.loggedIn = true;
    this.userSubject.next(this.loggedIn);
    this.bookService.fetchBooks(); // Fetch user's books immediately after login
    this.router.navigate(['/books-read']);
  }

  logOut() {
    // Clear local storage
    localStorage.removeItem('idToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('localId');
    localStorage.removeItem('email');

    // Reset loggedIn state and clear books
    this.loggedIn = false;
    this.userSubject.next(this.loggedIn);
    this.bookService.clearBooks();

    this.router.navigate(['/login']);
  }

  signUp(email: string, password: string) {
    const payload = { email, password, returnSecureToken: true };

    return this.http
      .post<any>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApikey}
`,
        payload
      )
      .subscribe(
        (response) => {
          // Save tokens and user ID in localStorage
          localStorage.setItem('idToken', response.idToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          localStorage.setItem('localId', response.localId);
          localStorage.setItem('email', response.email);

          this.logIn();
        },
        (error) => {
          console.error('Error during signup:', error);
        }
      );
  }

  logInUser(email: string, password: string) {
    const payload = { email, password, returnSecureToken: true };

    return this.http
      .post<any>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApikey}
`,
        payload
      )
      .subscribe(
        (response) => {
          // Save tokens and user ID in localStorage
          localStorage.setItem('idToken', response.idToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          localStorage.setItem('localId', response.localId);
          localStorage.setItem('email', response.email);

          this.logIn();
        },
        (error) => {
          console.error('Error during login:', error);
        }
      );
  }
}
