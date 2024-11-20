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
    'https://book-tracker-app-6e6fb-default-rtdb.asia-southeast1.firebasedatabase.app';

  constructor(private http: HttpClient) {}

  private getUserId(): string | null {
    return localStorage.getItem('localId');
  }

  addBook(newBook: book) {
    const userId = this.getUserId();
    if (!userId) {
      console.error('User ID not found! Make sure the user is logged in.');
      return;
    }

    this.http
      .post(`${this.firebaseDbUrl}/users/${userId}/readBooks.json`, newBook)
      .subscribe({
        next: () => {
          console.log('Book added successfully to Firebase!');
          const currentBooks = this.booksSubject.value;
          newBook.position = currentBooks.length + 1;
          this.booksSubject.next([...currentBooks, newBook]);
        },
        error: (error) => {
          console.error('Error adding book to Firebase:', error);
        },
      });
  }

  fetchBooks() {
    const userId = this.getUserId();
    if (!userId) {
      console.error('User ID not found! Make sure the user is logged in.');
      return;
    }

    this.http
      .get<{ [key: string]: book }>(
        `${this.firebaseDbUrl}/users/${userId}/readBooks.json`
      )
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
          console.log('Books fetched successfully from Firebase:', books);
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
            url: item.volumeInfo?.imageLinks?.thumbnail || './assets/default-thumbnail.png'
          }));

          const normalizeString = (str: string): string =>
            str
              .toLowerCase()
              .replace(/[^a-z0-9\s]/g, '')
              .trim();

          const filteredRecommendations = recommendations.filter((rec: any) => {
            const normalizedRecName = normalizeString(rec.name);
            const normalizedRecAuthor = normalizeString(rec.author);

            return !currentBooks.some((readBook) => {
              const normalizedReadName = normalizeString(readBook.name);
              const normalizedReadAuthor = normalizeString(readBook.author);

              return (
                normalizedReadName === normalizedRecName ||
                normalizedReadAuthor === normalizedRecAuthor
              );
            });
          });

          return filteredRecommendations;
        })
      );
  }

  clearBooks() {
    this.booksSubject.next([]);
  }
}
