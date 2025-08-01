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
import {
  MpesaPaymentRequest,
  PaymentService,
} from '../../services/payment.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

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
    MatProgressSpinnerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  shippingCost = 200; // Fixed shipping cost
  taxRate = 0.16; // 16% tax rate

  phoneNumber = '';
  isProcessingPayment = false;
  paymentStatus = 'idle';

  private paymentSubscription: Subscription = new Subscription();
  private cartSubscription: Subscription = new Subscription();

  constructor(
    private cartService: CartService,
    private paymentService: PaymentService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
    this.subscribeToPaymentStatus();
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

  private subscribeToPaymentStatus(): void {
    this.paymentSubscription = this.paymentService.paymentStatus$.subscribe(
      (status) => {
        this.paymentStatus = status;
        this.isProcessingPayment = status === 'processing';
      }
    );
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

    if (!this.phoneNumber) {
      this.showSnackBar('Please enter your phone number');
      return;
    }

    this.initiatePayment();
  }

  private initiatePayment(): void {
    const paymentData: MpesaPaymentRequest = {
      phone: this.paymentService.formatPhoneNumber(this.phoneNumber),
      amount: Math.round(this.getFinalTotal()),
      account_reference: `GF-${Date.now()}`,
      transaction_desc: `Payment for ${this.getTotalQuantity()} items from Garien Fashion`,
    };

    this.paymentService.initiatePayment(paymentData).subscribe({
      next: (response) => {
        if (response.success) {
          this.showSnackBar(
            'Payment request sent! Check your phone for MPesa prompt',
            'Close'
          );

          // Start checking payment status
          if (response.data?.CheckoutRequestID) {
            this.checkPaymentStatus(response.data.CheckoutRequestID);
          }
        } else {
          this.showSnackBar(`Payment failed: ${response.message}`, 'Close');
          this.paymentService.updatePaymentStatus('failed');
        }
      },
      error: (error) => {
        console.error('Payment error:', error);
        this.showSnackBar('Payment failed. Please try again.', 'Close');
        this.paymentService.updatePaymentStatus('failed');
      },
    });
  }

  private checkPaymentStatus(checkoutRequestID: string): void {
    // Check status after 30 seconds (give user time to complete payment)
    setTimeout(() => {
      this.paymentService.checkPaymentStatus(checkoutRequestID).subscribe({
        next: (statusResponse) => {
          if (statusResponse.data?.ResultCode === '0') {
            this.paymentService.updatePaymentStatus('success');
            this.showSnackBar('Payment successful! Order confirmed.', 'Close');
            this.cartService.clearCart();
            // Redirect to order confirmation or success page
            // this.router.navigate(['/order-success']);
          } else {
            this.paymentService.updatePaymentStatus('failed');
            this.showSnackBar(
              'Payment was not completed. Please try again.',
              'Close'
            );
          }
        },
        error: (error) => {
          console.error('Status check error:', error);
          this.paymentService.updatePaymentStatus('unknown');
          this.showSnackBar(
            'Unable to verify payment status. Please contact support.',
            'Close'
          );
        },
      });
    }, 30000);
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
