import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { book } from '../models/book.model';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
  ],
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css'], // Correct property name
})
export class AddBookComponent implements OnInit {
  bookForm = new FormGroup({
    name: new FormControl('', Validators.required),
    author: new FormControl('', Validators.required),
    imageUrl: new FormControl('', Validators.required),
  });

  @Input() bookToEdit: book | null = null; // Input for editing
  @Input() index:number|null = null;
  @Output() close = new EventEmitter<void>();

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    // Pre-fill form if editing a book
    if (this.bookToEdit) {
      this.bookForm.setValue({
        name: this.bookToEdit.name || '',
        author: this.bookToEdit.author || '',
        imageUrl: this.bookToEdit.url || '',
      });
    }
  }

  onClose(): void {
    this.bookForm.reset(); 
    this.close.emit(); // Emit close event
  }

  onSubmit(): void {
    if (this.bookForm.valid) {
      const book: book = {
        name: this.bookForm.value.name || '',
        author: this.bookForm.value.author || '',
        url: this.bookForm.value.imageUrl || '',
      };

      if(this.bookToEdit != null){
        this.bookService.editBook(this.index, book);
      }else{
        this.bookService.addBook(book);
      }

      this.onClose(); // Close the form
    }
  }
}
