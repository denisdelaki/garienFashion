import { Component, Input, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { FavoriteService } from '../../services/favorite.service';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    RouterModule,
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit, OnChanges, OnDestroy {
  products: Product[] = [];
  allProducts: Product[] = [];
  @Input() category: string = '';
  @Input() limit?: number;
  @Input() isTailored?: boolean;
  @Input() isFeatured?: boolean;
  @Input() gender: string = 'all';
  searchQuery: string = '';

  favoriteProducts: Set<number> = new Set();
  private routeSubscription: Subscription = new Subscription();
  private favoritesSubscription: Subscription = new Subscription();
  private genderFilterSubscription: Subscription = new Subscription();
  private searchFilterSubscription: Subscription = new Subscription();
  private productsSubscription: Subscription = new Subscription();

  constructor(
    private cartService: CartService,
    private favoritesService: FavoriteService,
    private snackBar: MatSnackBar,
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Initial load from API
    this.productService.getProducts().subscribe((products) => {});

    // Subscribe to real-time product updates
    this.productsSubscription = this.productService
      .getProductsObservable()
      .subscribe((products) => {
        this.allProducts = products;
        this.filterProducts();
      });

    // Subscribe to route parameters to get category
    this.routeSubscription = this.route.paramMap.subscribe((params) => {
      this.category = params.get('category') || '';
      this.filterProducts();
    });

    // Subscribe to favorites
    this.favoritesSubscription = this.favoritesService.favorites$.subscribe(
      (favorites) => {
        this.favoriteProducts = new Set(favorites.map((fav) => fav.id));
      }
    );
    // Subscribe to gender changes
    this.genderFilterSubscription = this.productService.gender$.subscribe(
      (gender) => {
        this.gender = gender;
        this.filterProducts();
      }
    );

    //subscribe to search changes
    this.searchFilterSubscription = this.productService.searchQuery$.subscribe(
      (query) => {
        this.searchQuery = query;
        this.filterProducts();
      }
    );
  }

  ngOnChanges(): void {
    if (this.allProducts.length > 0) {
      this.filterProducts();
    }
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
    this.favoritesSubscription.unsubscribe();
    this.genderFilterSubscription.unsubscribe();
    this.searchFilterSubscription.unsubscribe();
    this.productsSubscription.unsubscribe();
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.snackBar.open(`${product.name} added to cart!`, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['custom-snackbar'],
    });
  }

  toggleFavorite(product: Product): void {
    const isNowFavorite = this.favoritesService.toggleFavorite(product);
    const message = isNowFavorite
      ? `${product.name} added to favorites!`
      : `${product.name} removed from favorites!`;
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['custom-snackbar'],
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
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.category.toLowerCase() === this.category.toLowerCase()
      );
    }

    if (this.gender && this.gender !== 'all') {
      filteredProducts = filteredProducts.filter((product) => {
        if (!product.gender) {
          return this.gender === 'unisex';
        }
        return product.gender.toLowerCase() === this.gender.toLowerCase();
      });
    }

    // Limit number of products if specified
    if (this.limit && this.limit > 0) {
      filteredProducts = filteredProducts.slice(0, this.limit);
    }

    // Filter tailored products if isTailored is true
    if (this.isTailored) {
      filteredProducts = filteredProducts.filter(
        (product) => product.isTailored === true
      );
    }

    // Filter featured products if isFeatured is true
    if (this.isFeatured) {
      filteredProducts = filteredProducts.filter(
        (product) => product.isFeatured === true
      );
    }

    //filter searched products
    if (this.searchQuery && this.searchQuery.trim()) {
      const lowerQuery = this.searchQuery.toLowerCase().trim();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(lowerQuery) ||
          product.description.toLowerCase().includes(lowerQuery) ||
          product.category.toLowerCase().includes(lowerQuery)
      );
    }

    this.products = filteredProducts;
  }
}
