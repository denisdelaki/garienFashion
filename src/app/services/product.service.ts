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

  constructor(private http: HttpClient) {}
  private saveProducts(products: Product[]) {
    localStorage.setItem('products', JSON.stringify(products));
    this.productsSubject.next(products);
  }

  private products: Product[] = [
    // Regular Products
    {
      id: 1,
      name: 'Imported Dress',
      description: 'Stylish imported dress',
      price: 5000,
      category: 'Clothing',
      isTailored: false,
      isFeatured: true,
      isNewArrival: true,
      images: [
        'https://images.unsplash.com/photo-1709809081557-78f803ce93a0?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ],
    },
    {
      id: 2,
      name: 'Leather Sandals',
      description: 'High-quality leather sandals',
      price: 2500,
      category: 'Sandals',
      isTailored: false,
      images: [
        'https://images.unsplash.com/photo-1630407332126-70ebb700976b?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ],
    },

    // Tailored Products
    {
      id: 3,
      name: "Men's Tailored Suit",
      description:
        'Custom-fit suit for men with premium wool fabric and hand-stitched details.',
      price: 15000,
      category: 'suits',
      gender: 'Men',
      isTailored: true,
      isFeatured: true,
      isNewArrival: true,
      tailoringDetails: {
        fabricType: 'Premium Wool',
        constructionType: 'Hand-stitched',
        fittingIncluded: true,
        alterationsIncluded: 2,
        deliveryTime: '2-3 weeks',
      },
      images: [
        'https://images.unsplash.com/photo-1631682705590-5c1aa5dc67a3?q=80&w=1316&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1747171693567-702799baae9c?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1575111100769-15422779fb10?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ],
    },
    {
      id: 4,
      name: "Women's Tailored Kitenge Dress",
      description:
        'Elegant tailored dress with authentic African prints and custom fitting.',
      price: 8000,
      category: 'dresses',
      gender: 'Women',
      isTailored: true,
      isFeatured: true,
      isNewArrival: true,
      tailoringDetails: {
        fabricType: 'Authentic Kitenge',
        constructionType: 'Machine-stitched with hand finishing',
        fittingIncluded: true,
        alterationsIncluded: 1,
        deliveryTime: '1-2 weeks',
      },
      images: [
        'https://images.unsplash.com/photo-1663044023009-cfdb6dd6b89c?q=80&w=1307&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1687052034884-391a9e5ea8dd?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ],
    },
    {
      id: 5,
      name: "Kids' Tailored School Uniform",
      description:
        'Perfectly fitted school uniform tailored for growing children.',
      price: 3000,
      category: 'uniforms',
      gender: 'Kids',
      isTailored: true,
      tailoringDetails: {
        fabricType: 'Durable Cotton Blend',
        constructionType: 'Machine-stitched',
        fittingIncluded: true,
        alterationsIncluded: 1,
        deliveryTime: '1 week',
      },
      images: [
        'https://images.unsplash.com/photo-1706117386176-e0eab81b9abc?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://media.istockphoto.com/id/1252924010/photo/schoolgirl-in-a-school-near-masai-mara-game-reserve-in-kenya.webp?a=1&b=1&s=612x612&w=0&k=20&c=0A1k_FCMmFDytQp1E5C357oFdtO7O2S8f3X_b5QtrDQ=',
        'https://media.istockphoto.com/id/477839987/photo/african-school-kids.webp?a=1&b=1&s=612x612&w=0&k=20&c=3-ENVc-2jTwXgTa0L3pLm1okQBNkHo9rY8U-ZINQyCg=',
      ],
    },
    {
      id: 6,
      name: 'Unisex Tailored Ankara Shirt',
      description:
        'Stylish tailored shirt with vibrant Ankara patterns, suitable for all.',
      price: 5000,
      category: 'shirts',
      gender: 'Unisex',
      isTailored: true,
      tailoringDetails: {
        fabricType: 'Premium Ankara Cotton',
        constructionType: 'Machine-stitched with hand details',
        fittingIncluded: true,
        alterationsIncluded: 1,
        deliveryTime: '1-2 weeks',
      },
      images: [
        'https://media.istockphoto.com/id/1408649339/photo/family-posing-at-home.webp?a=1&b=1&s=612x612&w=0&k=20&c=LjdAi1QKwUzIs3mowlqxGFanA6QGL1c86jSg1Pm3hFs=',
        'https://media.istockphoto.com/id/1414595468/photo/people-posing-at-park-at-summer-holiday.webp?a=1&b=1&s=612x612&w=0&k=20&c=GBN3sUIKiSj6srqIN0ZBFwYoPaB11NyKvIgJHziHel8=',
      ],
    },
    {
      id: 7,
      name: "Men's Tailored Blazer",
      description:
        'Professional blazer with perfect fit and premium construction.',
      price: 12000,
      category: 'jackets',
      gender: 'Men',
      isTailored: true,
      tailoringDetails: {
        fabricType: 'Wool Blend',
        constructionType: 'Half-canvassed construction',
        fittingIncluded: true,
        alterationsIncluded: 2,
        deliveryTime: '2-3 weeks',
      },
      images: [
        'https://images.unsplash.com/photo-1631682705590-5c1aa5dc67a3?q=80&w=1316&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ],
    },
    {
      id: 8,
      name: "Women's Tailored Pencil Skirt",
      description:
        'Elegant pencil skirt with perfect fit and professional finish.',
      price: 4500,
      category: 'skirts',
      gender: 'Women',
      isTailored: true,
      tailoringDetails: {
        fabricType: 'Stretch Wool',
        constructionType: 'Machine-stitched with hand finishing',
        fittingIncluded: true,
        alterationsIncluded: 1,
        deliveryTime: '1 week',
      },
      images: [
        'https://images.unsplash.com/photo-1663044023009-cfdb6dd6b89c?q=80&w=1307&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ],
    },
    {
      id: 9,
      name: "Men's Tailored Dress Pants",
      description: 'Classic dress pants with custom fit and premium fabric.',
      price: 6000,
      category: 'pants',
      gender: 'Men',
      isTailored: true,
      tailoringDetails: {
        fabricType: 'Wool Gabardine',
        constructionType: 'Machine-stitched',
        fittingIncluded: true,
        alterationsIncluded: 1,
        deliveryTime: '1 week',
      },
      images: [
        'https://images.unsplash.com/photo-1575111100769-15422779fb10?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ],
    },
    {
      id: 10,
      name: 'Traditional Tailored Dashiki',
      description:
        'Authentic dashiki with traditional embroidery and custom fit.',
      price: 7500,
      category: 'traditional',
      gender: 'Unisex',
      isTailored: true,
      tailoringDetails: {
        fabricType: 'Traditional Cotton',
        constructionType: 'Hand-embroidered details',
        fittingIncluded: true,
        alterationsIncluded: 1,
        deliveryTime: '2-3 weeks',
      },
      images: [
        'https://media.istockphoto.com/id/1414595468/photo/people-posing-at-park-at-summer-holiday.webp?a=1&b=1&s=612x612&w=0&k=20&c=GBN3sUIKiSj6srqIN0ZBFwYoPaB11NyKvIgJHziHel8=',
      ],
    },
    {
      id: 11,
      name: "Women's Tailored Evening Gown",
      description:
        'Stunning evening gown with custom fit and luxurious fabric.',
      price: 18000,
      category: 'dresses',
      gender: 'Women',
      isTailored: true,
      tailoringDetails: {
        fabricType: 'Silk Chiffon',
        constructionType: 'Hand-sewn with beading',
        fittingIncluded: true,
        alterationsIncluded: 3,
        deliveryTime: '3-4 weeks',
      },
      images: [
        'https://images.unsplash.com/photo-1687052034884-391a9e5ea8dd?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ],
    },
    {
      id: 12,
      name: "Men's Tailored Tuxedo",
      description: 'Formal tuxedo with peak lapels and satin details.',
      price: 20000,
      category: 'suits',
      gender: 'Men',
      isTailored: true,
      isFeatured: true,
      tailoringDetails: {
        fabricType: 'Super 120s Wool',
        constructionType: 'Full-canvassed construction',
        fittingIncluded: true,
        alterationsIncluded: 3,
        deliveryTime: '3-4 weeks',
      },
      images: [
        'https://images.unsplash.com/photo-1747171693567-702799baae9c?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ],
    },
  ];

  // Get all products
  getProducts(): Observable<Product[]> {
    return this.http
      .get<Product[]>(this.apiUrl)
      .pipe(map((products) => products || []));
  }
  setGender(gender: string): void {
    this.genderSubject.next(gender);
  }

  getCurrentGender(): string {
    return this.genderSubject.value;
  }

  // Get product by ID
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  // Get products by gender
  getProductsByGender(gender: 'men' | 'Women' | 'kids' | 'unisex'): Product[] {
    return this.products.filter((product) => {
      if (!product.gender) {
        return gender === 'unisex';
      }
      return product.gender.toLowerCase() === gender.toLowerCase();
    });
  }

  // Get only tailored products
  getTailoredProducts(): Product[] {
    return this.products.filter((product) => product.isTailored === true);
  }

  addProduct(productData: ProductFormData): Product {
    const newProduct: Product = {
      ...productData,
      id: Date.now(),
      createdAt: new Date(),
      updatedAt: new Date(),
      images: productData.images || [],
      quantity: productData.quantity.toString(),
    };

    const currentProducts = this.productsSubject.value;
    const updatedProducts = [...currentProducts, newProduct];
    this.saveProducts(updatedProducts);
    this.http.post<Product>(`${this.apiUrl}`, newProduct).subscribe((res) => {
      console.log('Product saved successfully:', res);
    });

    return newProduct;
  }

  updateProduct(
    id: number,
    productData: Partial<ProductFormData>
  ): Product | null {
    const currentProducts = this.productsSubject.value;
    const productIndex = currentProducts.findIndex(
      (product) => product.id === id
    );

    if (productIndex === -1) {
      return null;
    }

    const updatedProduct: Product = {
      ...currentProducts[productIndex],
      ...productData,
      quantity: productData.quantity?.toString(),
      updatedAt: new Date(),
    };

    currentProducts[productIndex] = updatedProduct;
    this.saveProducts(currentProducts);

    return updatedProduct;
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
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
