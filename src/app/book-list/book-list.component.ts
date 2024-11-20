import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card'; // If you use cards to display data
import { MatFormFieldModule } from '@angular/material/form-field'; // For form inputs in the AddBookComponent
import { MatInputModule } from '@angular/material/input'; // For input fields in the AddBookComponent
import { CommonModule } from '@angular/common';
import { AddBookComponent } from '../add-book/add-book.component'; // Standalone component for adding books
import { book } from '../models/book.model';
import { BookService } from '../services/book.service';
import { MatGridListModule } from '@angular/material/grid-list'; // Grid list module

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    MatTableModule,       // For displaying books in a table
    MatButtonModule,      // For buttons like 'Add Book'
    MatDividerModule,     // For dividing sections
    MatIconModule,        // For using material icons
    MatCardModule,        // To use cards if necessary
    MatFormFieldModule,   // For material form fields
    MatInputModule,       // For material input fields
    CommonModule,         // For common directives like *ngIf and *ngFor
    AddBookComponent,
    MatGridListModule
         // Custom standalone component for adding books
  ],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'], 
})
export class BookListComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'author'];
  dataSource: book[] = [];
  isForm = false;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.bookService.books$.subscribe((books) => {
      console.log(books);

      this.dataSource = books;
    });
  }

  toggleDisplay() {
    this.isForm = !this.isForm;
    console.log(this.dataSource);

  }

  addBook(newBook: book) {
    this.bookService.addBook(newBook);
    this.toggleDisplay();
  }
}
