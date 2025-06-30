import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ProductsComponent } from '../products/products.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatButtonModule,
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

  constructor() {
    // Initialize cart count (you can connect this to a service later)
    this.cartItemCount = 0;
  }

  // Navigation methods
  toggleSearch(): void {
    this.showSearch = !this.showSearch;
    if (this.showSearch) {
      // Focus on search input after a brief delay
      setTimeout(() => {
        const searchInput = document.querySelector(
          '.search-input'
        ) as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }, 100);
    }
  }

  performSearch(): void {
    if (this.searchQuery.trim()) {
      // Implement search logic here
      console.log('Searching for:', this.searchQuery);
      // You can navigate to a search results page or filter products
      // this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
    }
  }

  openLogin(): void {
    // Implement login modal or navigation
    console.log('Opening login');
    // You can open a modal or navigate to login page
    // this.router.navigate(['/login']);
  }

  openCart(): void {
    // Implement cart modal or navigation
    console.log('Opening cart');
    // You can open a cart sidebar or navigate to cart page
    // this.router.navigate(['/cart']);
  }

  filterByGender(gender: string): void {
    this.selectedGender = gender;
    // This will be passed to the products component to filter products
    console.log('Filtering by gender:', gender);
  }

  // Method to handle keyboard events for search
  onSearchKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.performSearch();
    }
  }
}
