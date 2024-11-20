import { Component, OnInit } from '@angular/core';
import { book } from '../models/book.model';
import { BookService } from '../services/book.service';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-book-recommendations',
  standalone: true,
  imports: [
    MatTableModule,
    MatDividerModule,
    MatTableModule, // For displaying books in a table
    MatButtonModule, // For buttons like 'Add Book'
    MatIconModule, // For using material icons
    MatCardModule, // To use cards if necessary
    MatFormFieldModule, // For material form fields
    MatInputModule, // For material input fields
    CommonModule, // For common directives like *ngIf and *ngFor
    MatGridListModule,
  ],
  templateUrl: './book-recommendations.component.html',
  styleUrls: ['./book-recommendations.component.css'],
})
export class BookRecommendationsComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'author'];
  dataSource: book[] = [];
  isForm = false;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.fetchRecommendations();
  }

  fetchRecommendations() {
    this.bookService.getBooksRecommendations().subscribe(
      (recommendations: book[]) => {
        this.dataSource = recommendations.map((rec, index) => ({
          position: index + 1,
          name: rec.name,
          author: rec.author,
          url: rec.url,
        }));
      },
      (error) => {
        console.error('Error fetching recommendations:', error);
      }
    );
  }

  toggleDisplay() {
    this.isForm = !this.isForm;
  }

  addBook(newBook: book) {
    this.bookService.addBook(newBook);
    this.toggleDisplay();
  }
}
