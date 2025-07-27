export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  gender?: 'Men' | 'Women' | 'Kids' | 'Unisex';
  isTailored?: boolean;
  isAvailable?: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  inStock?: boolean;
  colors?: string[];
  quantity?: string;
  sizes?: string[];
  tailoringDetails?: {
    fabricType: string;
    constructionType: string;
    fittingIncluded: boolean;
    alterationsIncluded: number;
    deliveryTime: string;
  };
  category: string;
  imageUrl?: string;
  images: string[];
  updatedAt?: Date;
  createdAt?: Date;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  images?: string[];
  inStock: boolean;
  quantity: number;
  sizes?: string[];
  colors?: string[];
}
