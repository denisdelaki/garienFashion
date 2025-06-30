import { Component, Input, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { FavoriteService } from '../../services/favorite.service';
import { Product } from '../../models/product/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatSnackBarModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit, OnChanges, OnDestroy {
  products: Product[] = [];
  allProducts: Product[] = [];
  @Input() category: string = '';
  @Input() gender: string = '';
  @Input() limit?: number;

  favoriteProducts: Set<number> = new Set();
  private favoritesSubscription: Subscription = new Subscription();

  constructor(
    private cartService: CartService,
    private favoritesService: FavoriteService,
    private snackBar: MatSnackBar,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.allProducts = this.productService.getProducts();
    this.filterProducts();
    // Subscribe to favorites to track which products are favorited
    this.favoritesSubscription = this.favoritesService.favorites$.subscribe(
      (favorites) => {
        this.favoriteProducts = new Set(favorites.map((fav) => fav.id));
      }
    );
  }

  ngOnDestroy(): void {
    this.favoritesSubscription.unsubscribe();
  }

  addToCart(product: any): void {
    this.cartService.addToCart(product);
    this.snackBar.open(`${product.name} added to cart!`, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  toggleFavorite(product: any): void {
    const isNowFavorite = this.favoritesService.toggleFavorite(product);

    const message = isNowFavorite
      ? `${product.name} added to favorites!`
      : `${product.name} removed from favorites!`;

    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  isFavorite(productId: number): boolean {
    return this.favoriteProducts.has(productId);
  }

  getFavoriteIcon(productId: number): string {
    return this.isFavorite(productId) ? 'favorite' : 'favorite_border';
  }
  private filterProducts(): void {
    let filteredProducts = this.allProducts;

    // Filter by category if specified
    if (this.category) {
      filteredProducts = this.allProducts.filter(
        (product) =>
          product.category.toLowerCase() === this.category!.toLowerCase()
      );
    }

    // Limit number of products if specified
    if (this.limit && this.limit > 0) {
      filteredProducts = filteredProducts.slice(0, this.limit);
    }

    this.products = filteredProducts;
  }

  // Method to handle input changes
  ngOnChanges(): void {
    if (this.allProducts.length > 0) {
      this.filterProducts();
    }
  }
}
