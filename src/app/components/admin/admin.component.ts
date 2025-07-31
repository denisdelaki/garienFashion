import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Product, ProductFormData } from '../../models/product.model';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  products: Product[] = [];
  productForm: FormGroup;
  editingProduct: Product | null = null;
  isFormVisible = false;
  searchTerm = '';
  selectedCategory = '';

  categories = [
    "Men's Clothing",
    "Women's Clothing",
    'Accessories',
    'Shoes',
    'Bags',
    'Jewelry',
  ];

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  colors = [
    'Black',
    'White',
    'Red',
    'Blue',
    'Green',
    'Yellow',
    'Pink',
    'Purple',
    'Gray',
    'Brown',
  ];

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.productForm = this.createProductForm();
  }

  ngOnInit(): void {
    // Superuser access control
    if (!this.authService.isSuperUser) {
      this.router.navigate(['/']);
      return;
    }

    // Subscribe to reactive product store
    this.productService
      .getProductsObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe((products: Product[]) => {
        this.products = products;
      });

    // Call API only if local store is empty
    if (this.productService.getCurrentProducts().length === 0) {
      this.productService
        .getProducts()
        .pipe(takeUntil(this.destroy$))
        .subscribe();
    }

    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createProductForm(): FormGroup {
    return this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      category: ['', Validators.required],
      imageUrl: [
        '',
        [Validators.required, Validators.pattern(/^https?:\/\/.+/)],
      ],
      images: this.formBuilder.array([]),
      inStock: [true],
      quantity: [0, [Validators.required, Validators.min(0)]],
      sizes: this.formBuilder.array([]),
      colors: this.formBuilder.array([]),
    });
  }

  private initializeForm(): void {
    this.resetForm();
  }

  // Form Array Getters
  get imagesArray(): FormArray {
    return this.productForm.get('images') as FormArray;
  }

  get sizesArray(): FormArray {
    return this.productForm.get('sizes') as FormArray;
  }

  get colorsArray(): FormArray {
    return this.productForm.get('colors') as FormArray;
  }

  // Add/Remove Images
  addImageField(): void {
    this.imagesArray.push(
      this.formBuilder.control('', [Validators.pattern(/^https?:\/\/.+/)])
    );
  }

  removeImageField(index: number): void {
    this.imagesArray.removeAt(index);
  }

  // Handle Size Selection
  onSizeChange(size: string, event: any): void {
    if (event.target.checked) {
      this.sizesArray.push(this.formBuilder.control(size));
    } else {
      const index = this.sizesArray.controls.findIndex((x) => x.value === size);
      if (index >= 0) this.sizesArray.removeAt(index);
    }
  }

  // Handle Color Selection
  onColorChange(color: string, event: any): void {
    if (event.target.checked) {
      this.colorsArray.push(this.formBuilder.control(color));
    } else {
      const index = this.colorsArray.controls.findIndex(
        (x) => x.value === color
      );
      if (index >= 0) this.colorsArray.removeAt(index);
    }
  }

  isSizeSelected(size: string): boolean {
    return this.sizesArray.controls.some((control) => control.value === size);
  }

  isColorSelected(color: string): boolean {
    return this.colorsArray.controls.some((control) => control.value === color);
  }

  // Show/Hide Form
  showAddForm(): void {
    this.editingProduct = null;
    this.resetForm();
    this.isFormVisible = true;
  }

  hideForm(): void {
    this.isFormVisible = false;
    this.editingProduct = null;
    this.resetForm();
  }

  // Edit Product
  editProduct(product: Product): void {
    this.editingProduct = product;
    this.populateForm(product);
    this.isFormVisible = true;
  }

  private populateForm(product: Product): void {
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl || product.images?.[0] || '',
      inStock: product.inStock,
      quantity: product.quantity,
    });

    this.imagesArray.clear();
    product.images?.slice(1).forEach((img) => {
      this.imagesArray.push(this.formBuilder.control(img));
    });

    this.sizesArray.clear();
    product.sizes?.forEach((size) => {
      this.sizesArray.push(this.formBuilder.control(size));
    });

    this.colorsArray.clear();
    product.colors?.forEach((color) => {
      this.colorsArray.push(this.formBuilder.control(color));
    });
  }

  private resetForm(): void {
    this.productForm.reset({
      name: '',
      description: '',
      price: 0,
      category: '',
      imageUrl: '',
      inStock: true,
      quantity: 0,
    });
    this.imagesArray.clear();
    this.sizesArray.clear();
    this.colorsArray.clear();
  }

  // Submit Form
  onSubmit(): void {
    if (this.productForm.valid) {
      const formData: ProductFormData = {
        ...this.productForm.value,
        images: this.imagesArray.value.filter(
          (img: string) => img.trim() !== ''
        ),
        sizes: this.sizesArray.value,
        colors: this.colorsArray.value,
      };

      if (this.editingProduct) {
        this.updateProduct(formData);
      } else {
        this.addProduct(formData);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private addProduct(productData: ProductFormData): void {
    this.productService
      .addProduct(productData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.hideForm();
          this.showSuccessMessage('Product added successfully!');
        },
        error: () =>
          this.showErrorMessage('Failed to add product. Please try again.'),
      });
  }

  private updateProduct(productData: ProductFormData): void {
    if (!this.editingProduct) return;

    this.productService
      .updateProduct(this.editingProduct.id, productData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updated) => {
          if (updated) {
            this.hideForm();
            this.showSuccessMessage('Product updated successfully!');
          } else {
            this.showErrorMessage('Product not found.');
          }
        },
        error: () =>
          this.showErrorMessage('Failed to update product. Please try again.'),
      });
  }

  deleteProduct(product: Product): void {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      this.productService
        .deleteProduct(product.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => this.showSuccessMessage('Product deleted successfully!'),
          error: () =>
            this.showErrorMessage(
              'Failed to delete product. Please try again.'
            ),
        });
    }
  }

  get filteredProducts(): Product[] {
    let filtered = this.products;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term)
      );
    }

    if (this.selectedCategory) {
      filtered = filtered.filter((p) => p.category === this.selectedCategory);
    }

    return filtered;
  }

  private markFormGroupTouched(): void {
    Object.values(this.productForm.controls).forEach((control) => {
      control.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['minlength']) return `${fieldName} is too short`;
      if (field.errors['min']) return `${fieldName} must be greater than 0`;
      if (field.errors['pattern']) return `${fieldName} format is invalid`;
    }
    return '';
  }

  private showSuccessMessage(message: string): void {
    alert(message);
  }

  private showErrorMessage(message: string): void {
    alert(message);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
}
