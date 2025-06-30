import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product/product.model';
import { isPlatformBrowser } from '@angular/common';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  private cartCountSubject = new BehaviorSubject<number>(0);

  // Public observables
  cartItems$: Observable<CartItem[]> = this.cartItemsSubject.asObservable();
  cartCount$: Observable<number> = this.cartCountSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      // Load cart from localStorage on service initialization
      this.loadCartFromStorage();
    }
  }

  // Add product to cart
  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = this.cartItemsSubject.value;
    const existingItemIndex = currentItems.findIndex(
      (item) => item.product.id === product.id
    );

    if (existingItemIndex > -1) {
      // Product already exists, update quantity
      currentItems[existingItemIndex].quantity += quantity;
    } else {
      // New product, add to cart
      currentItems.push({ product, quantity });
    }

    this.updateCart(currentItems);
  }

  // Remove product from cart completely
  removeFromCart(productId: number): void {
    const currentItems = this.cartItemsSubject.value;
    const updatedItems = currentItems.filter(
      (item) => item.product.id !== productId
    );
    this.updateCart(updatedItems);
  }

  // Update quantity of a specific product
  updateQuantity(productId: number, quantityChange: number): void {
    const currentItems = this.cartItemsSubject.value;
    const itemIndex = currentItems.findIndex(
      (item) => item.product.id === productId
    );

    if (itemIndex > -1) {
      const newQuantity = currentItems[itemIndex].quantity + quantityChange;

      if (newQuantity <= 0) {
        // Remove item if quantity becomes 0 or negative
        this.removeFromCart(productId);
      } else {
        // Update quantity
        currentItems[itemIndex].quantity = newQuantity;
        this.updateCart(currentItems);
      }
    }
  }

  // Set specific quantity for a product
  setQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentItems = this.cartItemsSubject.value;
    const itemIndex = currentItems.findIndex(
      (item) => item.product.id === productId
    );

    if (itemIndex > -1) {
      currentItems[itemIndex].quantity = quantity;
      this.updateCart(currentItems);
    }
  }

  // Clear entire cart
  clearCart(): void {
    this.updateCart([]);
  }

  // Get current cart items
  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  // Get total number of items in cart
  getTotalItemCount(): number {
    return this.cartItemsSubject.value.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }

  // Get total price of all items in cart
  getTotalPrice(): number {
    return this.cartItemsSubject.value.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }

  // Check if product is in cart
  isInCart(productId: number): boolean {
    return this.cartItemsSubject.value.some(
      (item) => item.product.id === productId
    );
  }

  // Get quantity of specific product in cart
  getProductQuantity(productId: number): number {
    const item = this.cartItemsSubject.value.find(
      (item) => item.product.id === productId
    );
    return item ? item.quantity : 0;
  }

  // Private method to update cart and persist to storage
  private updateCart(items: CartItem[]): void {
    this.cartItemsSubject.next(items);
    this.cartCountSubject.next(this.calculateTotalCount(items));
    this.saveCartToStorage(items);
  }

  // Calculate total count of items
  private calculateTotalCount(items: CartItem[]): number {
    return items.reduce((total, item) => total + item.quantity, 0);
  }

  // Save cart to localStorage
  private saveCartToStorage(items: CartItem[]): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem('garienFashion_cart', JSON.stringify(items));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }

  // Load cart from localStorage
  private loadCartFromStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const savedCart = localStorage.getItem('garienFashion_cart');
        if (savedCart) {
          const items: CartItem[] = JSON.parse(savedCart);
          this.cartItemsSubject.next(items);
          this.cartCountSubject.next(this.calculateTotalCount(items));
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        // If there's an error, start with empty cart
        this.updateCart([]);
      }
    }
  }
}
