import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { book } from '../models/book.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private booksSubject = new BehaviorSubject<book[]>([]);
  books$ = this.booksSubject.asObservable();

  private firebaseDbUrl =
    'https://book-tracker-app-6e6fb-default-rtdb.asia-southeast1.firebasedatabase.app/books.json';

  constructor(private http: HttpClient) {}

  addBook(newBook: book) {
    const currentBooks = this.booksSubject.value;
    newBook.position = currentBooks.length + 1;

    this.http.post(this.firebaseDbUrl, newBook).subscribe({
      next: (response) => {
        console.log('Book added to Firebase:', response);
        this.booksSubject.next([...currentBooks, newBook]);
      },
      error: (error) => {
        console.error('Error adding book to Firebase:', error);
      },
    });
  }

  fetchBooks() {
    this.http
      .get<{ [key: string]: book }>(this.firebaseDbUrl)
      .pipe(
        map((responseData) => {
          const books: book[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              books.push({ ...responseData[key], position: books.length + 1 });
            }
          }
          return books;
        })
      )
      .subscribe({
        next: (books) => {
          this.booksSubject.next(books);
        },
        error: (error) => {
          console.error('Error fetching books from Firebase:', error);
        },
      });
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
