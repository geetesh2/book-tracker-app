import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit,OnDestroy {
  buttonText: string = 'Recommendations';
  isLoggedIn: boolean = false;

  constructor(private router: Router, private userService: UserService) {
    this.router.events.subscribe(() => {
      const currentRoute = this.router.url;
      this.buttonText = currentRoute.includes('books-read')
        ? 'Recommendations'
        : 'Read Books';
    });
  }

  ngOnInit(): void {
    this.userService.user$.pipe(takeUntilDestroyed()).subscribe((value: boolean) => {
      this.isLoggedIn = value;
    });
  }

  navigate() {
    const targetRoute =
      this.buttonText === 'Recommendations'
        ? '/recommendations'
        : '/books-read';
    this.router.navigate([targetRoute]);
  }

  logout() {
    this.userService.logOut();
  }

  ngOnDestroy(): void {
    this.userService.logOut();
  }
}
