import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { UserService } from '../services/user.service';

// Angular Material Modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { CommonModule } from '@angular/common'; // Required for basic Angular directives like *ngIf, *ngFor

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,  // For mat-toolbar
    MatButtonModule,   // For mat-raised-button and mat-icon-button
    MatIconModule,     // For mat-icon
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  buttonText: string = 'Recommendations';
  isLoggedIn: boolean = false;
  isSmallScreen: boolean = false;
  isSidenavOpen: boolean = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.userService.user$.subscribe((value: boolean) => {
      this.isLoggedIn = value;
    });

    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        this.isSmallScreen = result.matches;
      });

    this.router.events.subscribe(() => {
      const currentRoute = this.router.url;
      this.buttonText = currentRoute.includes('books-read')
        ? 'Recommendations'
        : 'Read Books';
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

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }

  ngOnDestroy(): void {
    this.userService.logOut();
  }
}
