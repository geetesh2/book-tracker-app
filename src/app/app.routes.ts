import { Routes } from '@angular/router';
import { BookListComponent } from './book-list/book-list.component';
import { BookRecommendationsComponent } from './book-recommendations/book-recommendations.component';

export const routes: Routes = [
  { path: 'books-read', component: BookListComponent },
  { path: 'recommendations', component: BookRecommendationsComponent },
  { path: '', redirectTo: '/books-read', pathMatch: 'full' },
  { path: '**', redirectTo: '/books-read' }, 
];
