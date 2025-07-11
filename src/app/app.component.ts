import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { ProductService } from './services/product.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'garienFashionHub';

  cartItemCount = 0;
  selectedGender = 'all';

  constructor(private router: Router, private productService: ProductService) {}
  onSearchPerformed(searchQuery: string): void {
    console.log('Search performed:', searchQuery);
  }

  onLoginClicked(): void {
    this.router.navigate(['/login']);
  }

  onCartClicked(): void {
    this.router.navigate(['/cart']);
  }
  onGenderFilterChanged(gender: string): void {
    this.selectedGender = gender;
    this.productService.setGender(gender);
  }
}
