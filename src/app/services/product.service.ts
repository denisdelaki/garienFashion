import { Injectable } from '@angular/core';
import { Product } from '../models/product/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor() {}

  private products: Product[] = [
    {
      id: 1,
      name: 'Imported Dress',
      description: 'Stylish imported dress',
      price: 5000,
      category: 'Clothing',
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
      images: [
        'https://images.unsplash.com/photo-1630407332126-70ebb700976b?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ],
    },
    {
      id: 1,
      name: 'Imported Dress',
      description: 'Stylish imported dress',
      price: 5000,
      category: 'Clothing',
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
      images: [
        'https://images.unsplash.com/photo-1630407332126-70ebb700976b?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ],
    },
    {
      id: 1,
      name: 'Imported Dress',
      description: 'Stylish imported dress',
      price: 5000,
      category: 'Clothing',
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
      images: [
        'https://images.unsplash.com/photo-1630407332126-70ebb700976b?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ],
    },
    {
      id: 1,
      name: 'Imported Dress',
      description: 'Stylish imported dress',
      price: 5000,
      category: 'Clothing',
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
      images: [
        'https://images.unsplash.com/photo-1630407332126-70ebb700976b?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ],
    },
    {
      id: 1,
      name: 'Imported Dress',
      description: 'Stylish imported dress',
      price: 5000,
      category: 'Clothing',
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
      images: [
        'https://images.unsplash.com/photo-1630407332126-70ebb700976b?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ],
    },
    {
      id: 1,
      name: 'Imported Dress',
      description: 'Stylish imported dress',
      price: 5000,
      category: 'Clothing',
      images: [
        'https://images.unsplash.com/photo-1709809081557-78f803ce93a0?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ],
    },
    {
      id: 2,
      name: 'Leather Sandals',
      description: 'High-quality leather sandals',
      price: 2500,
      category: 'featured',
      images: [
        'https://images.unsplash.com/photo-1630407332126-70ebb700976b?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ],
    },
    {
      id: 1,
      name: 'Imported Dress',
      description: 'Stylish imported dress',
      price: 5000,
      category: 'Clothing',
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
      images: [
        'https://images.unsplash.com/photo-1630407332126-70ebb700976b?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ],
    },
    {
      id: 1,
      name: 'Imported Dress',
      description: 'Stylish imported dress',
      price: 5000,
      category: 'Clothing',
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
      images: [
        'https://images.unsplash.com/photo-1630407332126-70ebb700976b?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ],
    },
    {
      id: 1,
      name: 'Imported Dress',
      description: 'Stylish imported dress',
      price: 5000,
      category: 'Clothing',
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
      images: [
        'https://images.unsplash.com/photo-1630407332126-70ebb700976b?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ],
    },
    {
      id: 1,
      name: 'Imported Dress',
      description: 'Stylish imported dress',
      price: 5000,
      category: 'Clothing',
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
      images: [
        'https://images.unsplash.com/photo-1630407332126-70ebb700976b?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ],
    },
    {
      id: 1,
      name: 'Imported Dress',
      description: 'Stylish imported dress',
      price: 5000,
      category: 'Clothing',
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
      images: [
        'https://images.unsplash.com/photo-1630407332126-70ebb700976b?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ],
    },
    {
      id: 1,
      name: 'Imported Dress',
      description: 'Stylish imported dress',
      price: 5000,
      category: 'featured',
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
      images: [
        'https://images.unsplash.com/photo-1630407332126-70ebb700976b?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ],
    },
    {
      id: 1,
      name: 'Imported Dress',
      description: 'Stylish imported dress',
      price: 5000,
      category: 'Clothing',
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
      images: [
        'https://images.unsplash.com/photo-1630407332126-70ebb700976b?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ],
    },
    {
      id: 1,
      name: 'Imported Dress',
      description: 'Stylish imported dress',
      price: 5000,
      category: 'Clothing',
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
      images: [
        'https://images.unsplash.com/photo-1630407332126-70ebb700976b?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ],
    },
    {
      id: 1,
      name: 'Imported Dress',
      description: 'Stylish imported dress',
      price: 5000,
      category: 'featured',
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
      images: [
        'https://images.unsplash.com/photo-1630407332126-70ebb700976b?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ],
    },
    {
      id: 1,
      name: 'Imported Dress',
      description: 'Stylish imported dress',
      price: 5000,
      category: 'Clothing',
      images: [
        'https://images.unsplash.com/photo-1709809081557-78f803ce93a0?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ],
    },
    {
      id: 2,
      name: 'Leather Sandals',
      description: 'High-quality leather sandals',
      price: 2500,
      category: 'featured',
      images: [
        'https://images.unsplash.com/photo-1630407332126-70ebb700976b?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ],
    },
    {
      id: 1,
      name: 'Imported Dress',
      description: 'Stylish imported dress',
      price: 5000,
      category: 'Clothing',
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
      images: [
        'https://images.unsplash.com/photo-1630407332126-70ebb700976b?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ],
    },
  ];

  getProducts(): Product[] {
    return this.products;
  }
}
