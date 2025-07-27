import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-orders',
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent {
  orders = [
    {
      bookName: "Don't Make Me Think",
      author: 'Steve Krug',
      price: 1500,
      originalPrice: 2000,
      orderDate: 'May 21',
      image: 'assets/bookimg.png',
    },
    {
      bookName: 'React Material-UI',
      author: 'Cookbook',
      price: 780,
      originalPrice: 1000,
      orderDate: 'April 06',
      image: 'assets/react.png',
    },
  ];
}
