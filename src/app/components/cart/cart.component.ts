import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  shippingCost = 200; // Fixed shipping cost
  taxRate = 0.16; // 16% tax rate

  private cartSubscription: Subscription = new Subscription();

  constructor(
    private cartService: CartService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
  }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
  }

  private loadCartItems(): void {
    // Subscribe to cart items from the service
    this.cartSubscription = this.cartService?.cartItems$.subscribe((items) => {
      this.cartItems = items;
    });
  }

  trackByProductId(index: number, item: CartItem): number {
    return item.product.id;
  }

  increaseQuantity(productId: number): void {
    this.cartService.updateQuantity(productId, 1);
    this.showSnackBar('Quantity updated');
  }

  decreaseQuantity(productId: number): void {
    const item = this.cartItems.find((item) => item.product.id === productId);
    if (item && item.quantity > 1) {
      this.cartService.updateQuantity(productId, -1);
      this.showSnackBar('Quantity updated');
    }
  }

  removeFromCart(productId: number): void {
    const item = this.cartItems.find((item) => item.product.id === productId);
    if (item) {
      this.cartService.removeFromCart(productId);
      this.showSnackBar(
        `${item.product.name} removed from cart`,
        'Undo',
        () => {
          this.cartService.addToCart(item.product, item.quantity);
        }
      );
    }
  }

  getTotalQuantity(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalPrice(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }

  getTaxAmount(): number {
    return this.getTotalPrice() * this.taxRate;
  }

  getFinalTotal(): number {
    return this.getTotalPrice() + this.shippingCost + this.getTaxAmount();
  }

  proceedToCheckout(): void {
    if (this.cartItems.length === 0) {
      this.showSnackBar('Your cart is empty');
      return;
    }

    // Here you would typically navigate to checkout or open a checkout dialog
    this.showSnackBar('Proceeding to checkout...', 'Close');

    // For now, we'll just log the order details
    const orderSummary = {
      items: this.cartItems,
      subtotal: this.getTotalPrice(),
      shipping: this.shippingCost,
      tax: this.getTaxAmount(),
      total: this.getFinalTotal(),
      totalQuantity: this.getTotalQuantity(),
    };

    console.log('Order Summary:', orderSummary);

    // Navigate to checkout page (you'll need to create this route)
    // this.router.navigate(['/checkout']);
  }

  private showSnackBar(
    message: string,
    action?: string,
    actionCallback?: () => void
  ): void {
    const snackBarRef = this.snackBar.open(message, action || 'Close', {
      duration: action === 'Undo' ? 5000 : 3000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['custom-snackbar'],
    });

    if (action === 'Undo' && actionCallback) {
      snackBarRef.onAction().subscribe(() => {
        actionCallback();
      });
    }
  }
}
