import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService } from '../../services/book/book.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-cart',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    RouterLink,
    MatRadioModule,
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  userName: string = '';
  userPhone: string = '';
  userAddress: string = '';
  userCity: string = '';
  userState: string = '';
  userType: string = '';
  selectedAddressIndex: number | null = null;
  addresses: any[] = [];
  showSummary: boolean = false;
  isContinueLoading: boolean = false;
  showCustomerDetails: boolean = false;

  constructor(private bookService: BookService, private router: Router) {}

  ngOnInit(): void {
    this.fetchCartItems();
    this.loadUserInfo();
  }

  fetchCartItems(): void {
    this.bookService.getCart().subscribe({
      next: (res: any) => {
        this.cartItems = res.result;
      },
      error: (err) => console.error('Failed to fetch cart items:', err),
    });
  }
  loadUserInfo(): void {
    const userInfo = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.userName = userInfo.fullName || '';
    this.userPhone = userInfo.phone || '';
    this.addresses = userInfo.address || [];
  }

  incrementQuantity(item: any): void {
    item.quantityToBuy += 1;
    this.updateCart(item);
  }

  decrementQuantity(item: any): void {
    if (item.quantityToBuy > 1) {
      item.quantityToBuy -= 1;
      this.updateCart(item);
    }
  }

  updateCart(item: any): void {
    this.bookService.updateCart(item._id, item.quantityToBuy).subscribe({
      next: () => {
        this.fetchCartItems();
      },
      error: (err) => console.error('Failed to update cart quantity:', err),
    });
  }

  removeFromCart(cartItemId: string): void {
    this.bookService.removeCart(cartItemId).subscribe({
      next: () => {
        this.fetchCartItems();
      },
      error: (err) => console.error('Failed to remove from cart:', err),
    });
  }

  selectAddress(index: number): void {
    this.selectedAddressIndex = index;
  }

  continueToSummary(): void {
    if (this.addresses.length === 0) {
      alert('No address available. Please add an address.');
      return;
    }

    this.isContinueLoading = true;

    setTimeout(() => {
      const selectedAddress = this.addresses[0];
      this.userAddress = selectedAddress.address;
      this.userCity = selectedAddress.city;
      this.userState = selectedAddress.state;
      this.userType = selectedAddress.type || 'Home';
      this.showSummary = true;

      this.isContinueLoading = false;
    }, 300);
  }

  orderNow(): void {
    const orderPayload = {
      orders: this.cartItems.map((item) => ({
        product_id: item.product_id._id,
        product_name: item.product_id.bookName,
        product_quantity: item.quantityToBuy,
        product_price: item.product_id.discountPrice,
      })),
    };

    this.bookService.addOrder(orderPayload).subscribe({
      next: (res: any) => {
        const orderId = res.result[0]._id;

        this.cartItems.forEach((item) => {
          this.bookService.removeCart(item._id).subscribe({
            next: () => {
              this.fetchCartItems();
            },
            error: (err) => console.error('Failed to remove from cart:', err),
          });
        });

        this.router.navigate(['home/orderSuccess'], {
          queryParams: { orderId: orderId },
        });
      },
      error: (err) => console.error('Failed to place order:', err),
    });
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => {
      return total + item.product_id.discountPrice * item.quantityToBuy;
    }, 0);
  }
}
