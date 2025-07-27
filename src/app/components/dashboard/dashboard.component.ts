import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { BookCardComponent } from '../book-card/book-card.component';
import { FooterComponent } from '../footer/footer.component';
import { BookService } from '../../services/book/book.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatToolbarModule,
    MatIconModule,
    CommonModule,
    MatDividerModule,
    MatMenuModule,
    BookCardComponent,
    FooterComponent,
    RouterLink,
    RouterOutlet,
    FormsModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  isLoggedIn = false;
  userName = 'User';
  currentPage: number = 1;
  itemsPerPage: number = 12;

  books: any[] = [];
  filteredBooks: any[] = [];
  searchText: string = '';

  constructor(private bookService: BookService, public router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;

    const userInfo = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.userName = userInfo.fullName || 'User';

    this.bookService.getBooks().subscribe({
      next: (res: any) => {
        this.books = res.result || [];
        this.filteredBooks = this.books;
        this.bookService.setBooks(this.books);
      },
      error: (err) => console.error('Error fetching books:', err),
    });
  }

  searchBooks(): void {
    const search = this.searchText.trim().toLowerCase();

    if (search.length === 0) {
      this.filteredBooks = this.books;
    } else {
      this.filteredBooks = this.books.filter((book: any) =>
        book.bookName.toLowerCase().includes(search)
      );
    }
  }

  clearSearch(): void {
    this.searchText = '';
    this.filteredBooks = this.books;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  cart() {
    this.router.navigate(['/home/cart']);
  }

  sortBooks(order: string): void {
    if (order === 'lowToHigh') {
      this.filteredBooks.sort((a, b) => a.discountPrice - b.discountPrice);
    } else if (order === 'highToLow') {
      this.filteredBooks.sort((a, b) => b.discountPrice - a.discountPrice);
    } else if (order === 'newest') {
      this.filteredBooks.sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
    }
  }

  get paginatedBooks() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredBooks.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.filteredBooks.length / this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
