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
  books$ = this.booksSubject.asObservable(); // Observable for components to subscribe to

  constructor() {}

  addBook(newBook: book) {
    const currentBooks = this.booksSubject.value; // Get current value of books
    this.booksSubject.next([...currentBooks, newBook]); // Update the array and notify subscribers
  }
}
