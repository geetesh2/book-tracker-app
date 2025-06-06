import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { book } from '../models/book.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

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
          const currentBooks = this.booksSubject.value;
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
              books.push({ ...responseData[key] });
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
        )}&key=${environment.booksApiKey}`
      )
      .pipe(
        map((response) => {
          const recommendations = response.items.map((item: any) => ({
            name: item.volumeInfo?.title || 'Unknown Title',
            author: item.volumeInfo?.authors?.join(', ') || 'Unknown Author',
            url:
              item.volumeInfo?.imageLinks?.thumbnail ||
              './assets/default-thumbnail.png',
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

  deleteBooks(position: number): void {
    const userId = this.getUserId();
    if (!userId) {
      console.error('User ID not found! Make sure the user is logged in.');
      return;
    }

    // Fetch the current list of books
    const currentBooks = this.booksSubject.value;

    // Get the book to be deleted based on position
    const bookToDelete = currentBooks[position];

    if (!bookToDelete) {
      console.error('Book not found at the specified position.');
      return;
    }

    // Get Firebase key for the book
    this.http
      .get<{ [key: string]: book }>(
        `${this.firebaseDbUrl}/users/${userId}/readBooks.json`
      )
      .pipe(
        map((responseData) => {
          // Find the key of the book to delete
          for (const key in responseData) {
            if (
              responseData[key].name === bookToDelete.name &&
              responseData[key].author === bookToDelete.author
            ) {
              return key; // Return the key
            }
          }
          return null; // If no match found
        })
      )
      .subscribe({
        next: (key) => {
          if (!key) {
            console.error('Book key not found in Firebase.');
            return;
          }

          // Delete the book from Firebase
          this.http
            .delete(
              `${this.firebaseDbUrl}/users/${userId}/readBooks/${key}.json`
            )
            .subscribe({
              next: () => {
                // Update the local list
                const updatedBooks = currentBooks.filter(
                  (_, index) => index !== position
                );
                this.booksSubject.next(updatedBooks);
              },
              error: (error) => {
                console.error('Error deleting book from Firebase:', error);
              },
            });
        },
        error: (error) => {
          console.error('Error fetching book keys from Firebase:', error);
        },
      });
  }

  editBook(pos: number | null, updatedBook: book | null): void {
    const books = this.booksSubject.value;
    const userId = this.getUserId();

    if (!userId) {
      console.error('User ID not found! Make sure the user is logged in.');
      return;
    }

    // Get the book's unique key from Firebase (assuming you store it as part of the data model)
    this.http
      .get<{ [key: string]: book }>(
        `${this.firebaseDbUrl}/users/${userId}/readBooks.json`
      )
      .subscribe({
        next: (responseData) => {
          const keys = Object.keys(responseData || {});
          const bookKey = keys[pos!]; // Retrieve the key for the book to edit

          if (!bookKey) {
            console.error('Book key not found for the given position.');
            return;
          }

          // Make the HTTP PUT request to update the book
          this.http
            .put(
              `${this.firebaseDbUrl}/users/${userId}/readBooks/${bookKey}.json`,
              updatedBook
            )
            .subscribe({
              next: () => {
                books[pos!] = updatedBook!; // Update the local copy
                this.booksSubject.next([...books]); // Update the observable
              },
              error: (error) => {
                console.error('Error updating book in Firebase:', error);
              },
            });
        },
        error: (error) => {
          console.error('Error retrieving book keys from Firebase:', error);
        },
      });
  }
}
