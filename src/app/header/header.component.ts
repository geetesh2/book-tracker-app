import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  buttonText: string = 'Recommendations';
  constructor(private router: Router) {
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
}
