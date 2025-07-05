import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() cartItemCount: number = 0;
  @Output() searchPerformed = new EventEmitter<string>();
  @Output() loginClicked = new EventEmitter<void>();
  @Output() cartClicked = new EventEmitter<void>();
  @Output() genderFilterChanged = new EventEmitter<string>();
  logoPath: string = 'https://ibb.co/HTvTnJzV';
  showProductsMenu = false;
  showTailoredMenu = false;
  showSearch = false;
  searchQuery = '';
  selectedGender = 'all';
  showGenderNavigation = false;
  mobileMenuOpen = false;

  private routerSubscription: Subscription = new Subscription();

  constructor(private router: Router, private cartService: CartService) {}

  ngOnInit(): void {
    this.checkCurrentRoute(this.router.url);
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.checkCurrentRoute(event.urlAfterRedirects);
      });

    this.cartService.cartCount$.subscribe((count) => {
      this.cartItemCount = count;
    });
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }

  toggleSearch(): void {
    this.showSearch = !this.showSearch;
  }

  performSearch(): void {
    if (this.searchQuery.trim()) {
      this.searchPerformed.emit(this.searchQuery);
      this.showSearch = false;
    }
  }

  openLogin(): void {
    this.loginClicked.emit();
  }

  openCart(): void {
    this.cartClicked.emit();
  }

  filterByGender(gender: string): void {
    this.selectedGender = gender;
    this.genderFilterChanged.emit(gender);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  private checkCurrentRoute(url: string): void {
    this.showGenderNavigation = url.includes('/products');
  }
}
