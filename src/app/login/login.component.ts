import { Component } from '@angular/core';
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
export class LoginComponent {
  isSignup = false;
  email = '';
  password = '';
  confirmPassword = '';

  constructor(private userService: UserService, private router: Router) {}

  toggleMode() {
    this.isSignup = !this.isSignup;
  }

  onSubmit() {
    if (this.isSignup) {
      this.userService.logIn();
    } else {
      this.userService.logIn();
    }
    this.router.navigate(['/books-read']);
  }
}
