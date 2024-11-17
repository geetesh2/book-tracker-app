import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { book } from '../models/book.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private booksSubject = new BehaviorSubject<book[]>([
    { position: 1, name: 'Atomic Habits', author: 'James Clear' },
  ]);
  books$ = this.booksSubject.asObservable();

  constructor(private http: HttpClient) {}

  addBook(newBook: book) {
    const currentBooks = this.booksSubject.value;
    newBook.position = currentBooks.length + 1;
    this.booksSubject.next([...currentBooks, newBook]);
  }

  getBooksRecommendations() {
    const currentBooks = this.booksSubject.value;

    const query = currentBooks.map((book) => book.name).join(' OR ');

    return this.http
      .get<any>(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          query
        )}&key=AIzaSyDZo98mIafQbKHHVhBmMTUKzP07VWsGg1M`
      )
      .pipe(
        map((response) => {
          const recommendations = response.items.map((item: any) => ({
            name: item.volumeInfo?.title || 'Unknown Title',
            author: item.volumeInfo?.authors?.join(', ') || 'Unknown Author',
          }));

          const filteredRecommendations = recommendations.filter(
            (rec: any) =>
              !currentBooks.some(
                (readBook) =>
                  readBook.name.toLowerCase() === rec.name.toLowerCase() ||
                  readBook.author.toLowerCase() === rec.author.toLowerCase()
              )
          );

          return filteredRecommendations;
        })
      );
  }
}
