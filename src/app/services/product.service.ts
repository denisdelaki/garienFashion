import { Injectable } from '@angular/core';
import { Product, ProductFormData } from '../models/product.model';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private genderSubject = new BehaviorSubject<string>('all');
  private searchQuerySubject = new BehaviorSubject<string>('');
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public gender$: Observable<string> = this.genderSubject.asObservable();
  public searchQuery$: Observable<string> =
    this.searchQuerySubject.asObservable();
  public filteredProducts$: Observable<Product[]> = combineLatest([
    this.gender$,
    this.searchQuery$,
  ]).pipe(
    map(([gender, searchQuery]) =>
      this.getFilteredProducts(
        gender as 'men' | 'Women' | 'kids' | 'unisex',
        searchQuery
      )
    )
  );

  private apiUrl = 'https://garien-fashion-backend.vercel.app/products';

  constructor(private http: HttpClient) {
    // Initialize with empty array
    this.productsSubject.next([]);
  }
  private saveProducts(products: Product[]) {
    localStorage.setItem('products', JSON.stringify(products));
    this.productsSubject.next(products);
  }

  // Get all products from API and update local state

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      map((products) => {
        // Only use products from the database, ignore local mock data
        const allProducts = products || [];
        this.saveProducts(allProducts);
        return allProducts;
      })
    );
  }
  getCurrentProducts(): Product[] {
    return this.productsSubject.value;
  }

  // Get products observable for real-time updates
  getProductsObservable(): Observable<Product[]> {
    return this.productsSubject.asObservable();
  }
  setGender(gender: string): void {
    this.genderSubject.next(gender);
  }

  getCurrentGender(): string {
    return this.genderSubject.value;
  }

  // Get product by ID
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}?id=${id}`);
  }

  // Get products by gender
  getProductsByGender(gender: 'men' | 'Women' | 'kids' | 'unisex'): Product[] {
    const currentProducts = this.productsSubject.value;
    return currentProducts.filter((product) => {
      if (!product.gender) {
        return gender === 'unisex';
      }
      return product.gender.toLowerCase() === gender.toLowerCase();
    });
  }

  // Get only tailored products
  getTailoredProducts(): Product[] {
    const currentProducts = this.productsSubject.value;
    return currentProducts.filter((product) => product.isTailored === true);
  }

  addProduct(productData: ProductFormData): Observable<Product> {
    // Prepare product data for backend (let backend assign ID and timestamps)
    const productPayload = {
      ...productData,
      images: productData.imageUrl
        ? [productData.imageUrl, ...(productData.images || [])]
        : productData.images || [],
      quantity: productData.quantity.toString(),
    };

    return this.http.post<Product>(`${this.apiUrl}`, productPayload).pipe(
      map((response) => {
        // Update local state with the actual product from backend
        const currentProducts = this.productsSubject.value;
        const updatedProducts = [...currentProducts, response];
        this.saveProducts(updatedProducts);
        return response;
      })
    );
  }

  updateProduct(
    id: number,
    productData: Partial<ProductFormData>
  ): Observable<Product | null> {
    const currentProducts = this.productsSubject.value;
    const productIndex = currentProducts.findIndex(
      (product) => product.id === id
    );

    if (productIndex === -1) {
      return new Observable((observer) => observer.next(null));
    }

    const updatedProduct: Product = {
      ...currentProducts[productIndex],
      ...productData,
      quantity: productData.quantity?.toString(),
      updatedAt: new Date(),
    };

    // Update local state first
    currentProducts[productIndex] = updatedProduct;
    this.saveProducts(currentProducts);

    // Prepare data for backend (exclude id and let backend handle updated_at)
    const updatePayload = {
      ...productData,
      quantity: productData.quantity?.toString(),
      // Ensure images array includes the main image URL
      images: productData.imageUrl
        ? [productData.imageUrl, ...(productData.images || [])]
        : productData.images || [],
    };

    return this.http
      .put<Product>(`${this.apiUrl}?id=${id}`, updatePayload)
      .pipe(
        map((response) => {
          // Update local state with the response from backend
          const responseProduct = response as Product;
          currentProducts[productIndex] = responseProduct;
          this.saveProducts(currentProducts);
          return responseProduct;
        })
      );
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}?id=${id}`).pipe(
      map((response) => {
        // Update local state after successful deletion
        const currentProducts = this.productsSubject.value;
        const filteredProducts = currentProducts.filter(
          (product) => product.id !== id
        );
        this.saveProducts(filteredProducts);
        return response;
      })
    );
  }

  private getFilteredProducts(
    gender: 'men' | 'Women' | 'kids' | 'unisex',
    searchQuery: string
  ): Product[] {
    let filteredProducts = this.getProductsByGender(gender);

    if (searchQuery && searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(lowerQuery) ||
          product.description.toLowerCase().includes(lowerQuery) ||
          product.category.toLowerCase().includes(lowerQuery)
      );
    }

    return filteredProducts;
  }

  getCurrentSearchQuery(): string {
    return this.searchQuerySubject.value;
  }

  searchProducts(query: string): Product[] {
    if (!query.trim()) {
      return this.getProductsByGender(
        this.getCurrentGender() as 'men' | 'Women' | 'kids' | 'unisex'
      );
    }
    const lowerQuery = query.toLowerCase();
    return this.getProductsByGender(
      this.getCurrentGender() as 'men' | 'Women' | 'kids' | 'unisex'
    ).filter(
      (product) =>
        product.name.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery)
    );
  }

  // Set search query
  setSearchQuery(query: string): void {
    this.searchQuerySubject.next(query);
  }

  // Clear search query
  clearSearch(): void {
    this.searchQuerySubject.next('');
  }
}
