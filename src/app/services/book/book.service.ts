import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private books: any[] = [];

  constructor(private http: HttpService) {}

  getBooks() {
    return this.http.getApi('bookstore_user/get/book', this.http.getHeader());
  }

  setBooks(books: any[]) {
    this.books = books;
  }

  getBookById(id: string) {
    return this.books.find((book) => book._id === id);
  }

  getWish() {
    return this.http.getApi(
      'bookstore_user/get_wishlist_items',
      this.http.getHeader()
    );
  }

  postWish(productId: string) {
    const headers = this.http.getHeader();
    return this.http.postApi(
      `bookstore_user/add_wish_list/${productId}`,
      {},
      headers
    );
  }

  removeWish(productId: string) {
    const headers = this.http.getHeader();
    return this.http.deleteApi(
      `bookstore_user/remove_wishlist_item/${productId}`,
      headers
    );
  }

  getCart() {
    const headers = this.http.getHeader();
    return this.http.getApi('bookstore_user/get_cart_items', headers);
  }

  addCart(productId: string) {
    const headers = this.http.getHeader();
    return this.http.postApi(
      `bookstore_user/add_cart_item/${productId}`,
      {},
      headers
    );
  }

  updateCart(cartItemId: string, quantity: number) {
    const headers = this.http.getHeader();
    return this.http.putApi(
      `bookstore_user/cart_item_quantity/${cartItemId}`,
      { quantityToBuy: quantity },
      headers
    );
  }

  removeCart(cartItemId: string) {
    const headers = this.http.getHeader();
    return this.http.deleteApi(
      `bookstore_user/remove_cart_item/${cartItemId}`,
      headers
    );
  }

  addOrder(orderPayload: {
    orders: {
      product_id: string;
      product_name: string;
      product_quantity: number;
      product_price: number;
    }[];
  }) {
    const headers = this.http.getHeader();
    return this.http.postApi('bookstore_user/add/order', orderPayload, headers);
  }
}
