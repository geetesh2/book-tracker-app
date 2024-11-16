import { Component } from '@angular/core';
import { book } from '../models/book.model';
import { BookService } from '../services/book.service';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-book-recommendations',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
  ],
  templateUrl: './book-recommendations.component.html',
  styleUrl: './book-recommendations.component.css'
})
export class BookRecommendationsComponent {
  displayedColumns: string[] = ['position', 'name', 'author'];
  dataSource: book[] = [];
  isForm = false;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.bookService.books$.subscribe((books) => {
      this.dataSource = books;
    });
  }

  toggleDisplay() {
    this.isForm = !this.isForm;
  }

  addBook(newBook: book) {
    this.bookService.addBook(newBook); 
    this.toggleDisplay();
  }
}
