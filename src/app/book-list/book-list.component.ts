import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AddBookComponent } from "../add-book/add-book.component";

export interface books {
  name: string;
  position: number;
  author: string;
}

const ELEMENT_DATA: books[] = [
  { position: 1, name: 'Hydrogen', author: 'Narayan'},
];

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatDividerModule, MatIconModule, CommonModule, AddBookComponent],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css',
})
export class BookListComponent {
  displayedColumns: string[] = ['position', 'name', 'author'];
  dataSource = ELEMENT_DATA;
  isForm = false;
  
  toggleDisplay(){
    this.isForm = !this.isForm;
  }
}
