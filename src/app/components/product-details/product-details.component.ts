import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-details',
  imports: [MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
  product: Product | undefined;
  selectedImage: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private productService: ProductService,
    private cartService: CartService,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService
      .getProductById(id)
      .subscribe((product: Product | undefined) => {
        this.product = product;
        this.selectedImage = this.product?.images[0];
      });
  }

  goBack(): void {
    this.location.back();
  }

  buyNow(): void {
    if (this.product) {
      // Add product to cart
      this.cartService.addToCart(this.product);

      // Show success message
      this.snackBar.open(`${this.product.name} added to cart!`, 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
        panelClass: ['custom-snackbar'],
      });

      // Navigate to cart
      this.router.navigate(['/cart']);
    }
  }

  changeImage(image: string): void {
    this.selectedImage = image;
  }

  getCurrentUrl(): string {
    if (isPlatformBrowser(this.platformId)) {
      return window.location.href;
    }
    return '';
  }
}
