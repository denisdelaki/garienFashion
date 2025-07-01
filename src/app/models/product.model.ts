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
  tailoringDetails?: {
    fabricType: string;
    constructionType: string;
    fittingIncluded: boolean;
    alterationsIncluded: number;
    deliveryTime: string;
  };
  category: string;
  images: string[];
}
