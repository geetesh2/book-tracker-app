import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  loggedIn = false;
  private userSubject = new BehaviorSubject<boolean>(this.loggedIn);

  user$ = this.userSubject.asObservable();
  constructor() { }

  logIn(){
    this.loggedIn = true;
    this.userSubject.next(this.loggedIn);
  }

  logOut(){
    this.loggedIn = false;
    this.userSubject.next(this.loggedIn);
  }
}
