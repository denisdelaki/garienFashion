import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private favoriteItems: any[] = [];
  private favoritesSubject = new BehaviorSubject<any[]>([]);

  favorites$ = this.favoritesSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      // Load favorites from localStorage if available
      this.loadFavoritesFromStorage();
    }
  }

  addToFavorites(product: any): void {
    const existingIndex = this.favoriteItems.findIndex(
      (item) => item.id === product.id
    );

    if (existingIndex === -1) {
      this.favoriteItems.push(product);
      this.updateFavorites();
    }
  }

  removeFromFavorites(productId: number): void {
    this.favoriteItems = this.favoriteItems.filter(
      (item) => item.id !== productId
    );
    this.updateFavorites();
  }

  toggleFavorite(product: any): boolean {
    const existingIndex = this.favoriteItems.findIndex(
      (item) => item.id === product.id
    );

    if (existingIndex === -1) {
      this.addToFavorites(product);
      return true; // Added to favorites
    } else {
      this.removeFromFavorites(product.id);
      return false; // Removed from favorites
    }
  }

  isFavorite(productId: number): boolean {
    return this.favoriteItems.some((item) => item.id === productId);
  }

  getFavorites(): any[] {
    return [...this.favoriteItems];
  }

  clearFavorites(): void {
    this.favoriteItems = [];
    this.updateFavorites();
  }

  private updateFavorites(): void {
    this.favoritesSubject.next([...this.favoriteItems]);
    this.saveFavoritesToStorage();
  }

  private saveFavoritesToStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('favorites', JSON.stringify(this.favoriteItems));
    }
  }

  private loadFavoritesFromStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedFavorites = localStorage.getItem('favorites');
      if (savedFavorites) {
        this.favoriteItems = JSON.parse(savedFavorites);
        this.updateFavorites();
      }
    }
  }
}
