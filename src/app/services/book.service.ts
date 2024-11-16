import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { book } from '../models/book.model';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private booksSubject = new BehaviorSubject<book[]>([
    { position: 1, name: 'Hydrogen', author: 'Narayan' },
  ]);
  books$ = this.booksSubject.asObservable();

  constructor() {}

  addBook(newBook: book) {
    const currentBooks = this.booksSubject.value; 
    newBook.position = currentBooks.length + 1;
    this.booksSubject.next([...currentBooks, newBook]);
  }
}
