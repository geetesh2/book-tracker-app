import { Routes } from '@angular/router';
import { BookListComponent } from './book-list/book-list.component';
import { BookRecommendationsComponent } from './book-recommendations/book-recommendations.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'books-read',
    component: BookListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'recommendations',
    component: BookRecommendationsComponent,
    canActivate: [authGuard],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/books-read' },
];
