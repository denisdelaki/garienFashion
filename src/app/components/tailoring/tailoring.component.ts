import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { ProductsComponent } from '../products/products.component';
import { TailoringService } from '../../services/tailoring.service';

interface Category {
  value: string;
  label: string;
}
interface Gender {
  value: string;
  label: string;
}
interface UrgencyOption {
  value: string;
  label: string;
  multiplier: number;
}

import {
  animate,
  style,
  transition,
  trigger,
  stagger,
  query,
} from '@angular/animations';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-tailoring',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    ProductsComponent,
  ],
  templateUrl: './tailoring.component.html',
  styleUrl: './tailoring.component.scss',
  animations: [
    trigger('fadeSlideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms ease-in',
          style({ opacity: 0, transform: 'translateY(20px)' })
        ),
      ]),
    ]),
    trigger('staggerItems', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(20px)' }),
            stagger('150ms', [
              animate(
                '500ms ease-out',
                style({ opacity: 1, transform: 'translateY(0)' })
              ),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class TailoringComponent implements OnInit {
  tailoringRequestForm: FormGroup;
  showRequestForm: boolean = false;
  estimatedPrice: number = 0;
  categories: Category[] = [
    { value: 'all', label: 'All' },
    { value: 'Clothing', label: 'Clothing' },
    { value: 'Accessories', label: 'Accessories' },
  ];
  genders: Gender[] = [
    { value: 'all', label: 'All' },
    { value: 'Men', label: 'Men' },
    { value: 'Women', label: 'Women' },
    { value: 'Kids', label: 'Kids' },
    { value: 'Unisex', label: 'Unisex' },
  ];
  styles: string[] = [
    'Suit',
    'Dress',
    'Shirt',
    'Skirt',
    'Trousers',
    'Traditional Kitenge',
    'Headscarf',
  ];
  sizes: string[] = ['XS', 'S', 'M', 'L', 'XL', 'Custom'];
  urgencyOptions: UrgencyOption[] = [
    { value: 'standard', label: 'Standard (2-3 weeks)', multiplier: 1 },
    { value: 'express', label: 'Express (1-2 weeks)', multiplier: 1.5 },
    { value: 'urgent', label: 'Urgent (3-5 days)', multiplier: 2 },
  ];
  selectedCategory: string = 'all';
  selectedGender: string = 'all';

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.tailoringRequestForm = this.fb.group({
      customerName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^\+?\d{10,15}$/)]],
      category: ['', Validators.required],
      gender: ['', Validators.required],
      style: ['', Validators.required],
      size: ['', Validators.required],
      measurements: this.fb.group({
        chest: ['', [Validators.min(0), Validators.max(60)]],
        waist: ['', [Validators.min(0), Validators.max(60)]],
        hips: ['', [Validators.min(0), Validators.max(60)]],
        length: ['', [Validators.min(0), Validators.max(60)]],
        sleeves: ['', [Validators.min(0), Validators.max(40)]],
      }),
      budget: ['', [Validators.required, Validators.min(500)]],
      urgency: ['standard'],
      description: ['', [Validators.maxLength(1000)]],
    });
  }

  ngOnInit(): void {
    this.tailoringRequestForm.valueChanges.subscribe(() =>
      this.calculateEstimatedPrice()
    );
  }

  calculateEstimatedPrice(): void {
    const formValues = this.tailoringRequestForm.value;
    let basePrice = 0;

    switch (formValues.style) {
      case 'Suit':
        basePrice = 15000;
        break;
      case 'Dress':
        basePrice = 8000;
        break;
      case 'Shirt':
        basePrice = 5000;
        break;
      case 'Skirt':
        basePrice = 6000;
        break;
      case 'Trousers':
        basePrice = 7000;
        break;
      case 'Traditional Kitenge':
        basePrice = 12000;
        break;
      case 'Headscarf':
        basePrice = 4000;
        break;
      default:
        basePrice = 5000;
    }

    const urgency = this.urgencyOptions.find(
      (opt) => opt.value === formValues.urgency
    );
    this.estimatedPrice = basePrice * (urgency?.multiplier || 1);
  }

  getErrorMessage(controlName: string): string {
    const control = this.tailoringRequestForm.get(controlName);
    if (control?.hasError('required')) return `${controlName} is required`;
    if (control?.hasError('email')) return 'Invalid email format';
    if (control?.hasError('pattern')) return 'Invalid phone number';
    if (control?.hasError('minlength'))
      return `${controlName} must be at least 2 characters`;
    if (control?.hasError('min'))
      return `${controlName} must be at least ${
        controlName === 'budget' ? 'KES 500' : '0'
      }`;
    if (control?.hasError('max'))
      return `${controlName} must not exceed ${
        controlName === 'budget'
          ? 'KES 100000'
          : controlName === 'sleeves'
          ? '40'
          : '60'
      }`;
    if (control?.hasError('maxlength'))
      return 'Description must not exceed 1000 characters';
    return '';
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
    }).format(value);
  }

  getUrgencyLabel(option: UrgencyOption): string {
    return option.label;
  }

  onSubmitRequest(): void {
    if (this.tailoringRequestForm.valid) {
      console.log('Tailoring Request:', this.tailoringRequestForm.value);
      this.tailoringRequestForm.reset();
      this.showRequestForm = false;
      this.estimatedPrice = 0;
    }
  }

  toggleRequestForm(): void {
    this.showRequestForm = !this.showRequestForm;
  }

  getCurrentCategory(): string {
    return this.selectedCategory === 'all' ? '' : this.selectedCategory;
  }

  getCurrentGender(): string {
    return this.selectedGender === 'all' ? '' : this.selectedGender;
  }
  getCategoryLabel(categoryValue: string): string {
    const category = this.categories.find((cat) => cat.value === categoryValue);
    return category ? category.label : categoryValue;
  }

  getGenderLabel(genderValue: string): string {
    const gender = this.genders.find((gen) => gen.value === genderValue);
    return gender ? gender.label : genderValue;
  }

  // Filter change handlers
  onCategoryChange(categoryValue: string): void {
    this.selectedCategory = categoryValue;
  }

  onGenderChange(genderValue: string): void {
    this.selectedGender = genderValue;
  }
}
