import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductsComponent } from '../products/products.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    ProductsComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  // Navigation state
  showProductsMenu = false;
  showTailoredMenu = false;
  showSearch = false;

  // Search functionality
  searchQuery = '';

  // Cart state
  cartItemCount = 0;

  // Gender filter
  selectedGender = 'all';

  constructor(private router: Router) {
    // Initialize cart count (you can connect this to a service later)
    this.cartItemCount = 0;
  }
}
