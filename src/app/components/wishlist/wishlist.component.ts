import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { BookService } from '../../services/book/book.service';

@Component({
  selector: 'app-wishlist',
  imports: [CommonModule, MatIconModule, RouterLink, MatButtonModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss',
})
export class WishlistComponent implements OnInit {
  wishlist: any[] = [];

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.fetchWishlist();
  }

  fetchWishlist(): void {
    this.bookService.getWish().subscribe({
      next: (res: any) => {
        this.wishlist = res.result;
      },
      error: (err) => console.error('Failed to fetch wishlist:', err),
    });
  }

  removeFromWishlist(productId: string): void {
    this.bookService.removeWish(productId).subscribe({
      next: () => {
        this.fetchWishlist();
      },
      error: (err) => console.error('Failed to remove item:', err),
    });
  }
}
