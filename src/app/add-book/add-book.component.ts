import { Component, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {FormGroup, FormControl} from '@angular/forms';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { book } from '../models/book.model';

@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [ReactiveFormsModule,MatDividerModule,MatButtonModule,MatIconModule,CommonModule],
  templateUrl: './add-book.component.html',
  styleUrl: './add-book.component.css'
})
export class AddBookComponent {
  bookForm = new FormGroup({
    name: new FormControl(''),
    author: new FormControl(''),
  });
   newBook: book | null = null;

  @Output() close = new EventEmitter<void>();

  onClose(){
    this.close.emit();
  }

  onSubmit(){
    this.newBook = {
      name: this.bookForm.value.name || '',
      author: this.bookForm.value.author || ''
    };
    this.onClose();
  }
}
