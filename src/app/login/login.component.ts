import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit
{
  isSignup = false;
  email = '';
  password = '';
  confirmPassword = '';

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.logOut();
  }
  
  toggleMode() {
    this.isSignup = !this.isSignup;
  }

  onSubmit() {
    if (this.isSignup) {
      this.userService.signUp(this.email, this.password);
    } else {
      this.userService.logInUser(this.email, this.password);
    }
  }
}
