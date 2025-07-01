export interface TailoringRequest {
  id?: number;
  customerName: string;
  email: string;
  phone: string;
  category: string;
  gender: string;
  style: string;
  size: string;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    length?: number;
    sleeves?: number;
  };
  budget: number;
  description: string;
  urgency: string;
  createdAt?: Date;
  status?: 'pending' | 'in-progress' | 'completed' | 'cancelled';
}
