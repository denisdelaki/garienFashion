import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'garienFashionHub';

  cartItemCount = 0;

  constructor(private router: Router) {}
  onSearchPerformed(searchQuery: string): void {
    console.log('Search performed:', searchQuery);
  }

  onLoginClicked(): void {
    this.router.navigate(['/login']);
  }

  onCartClicked(): void {
    this.router.navigate(['/cart']);
  }
}
