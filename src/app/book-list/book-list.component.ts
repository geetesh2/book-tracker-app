import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AddBookComponent } from '../add-book/add-book.component';
import { book } from '../models/book.model';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    CommonModule,
    AddBookComponent,
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
