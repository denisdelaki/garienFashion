import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Product } from '../../models/product/product.model';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-products',
  imports: [CommonModule, MatButtonModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  standalone: true,
})
export class ProductsComponent implements OnInit, OnChanges {
  products: Product[] = [];
  allProducts: Product[] = [];
  @Input() category: string = '';
  @Input() gender: string = '';
  @Input() limit?: number;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.allProducts = this.productService.getProducts();
    this.filterProducts();
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
