import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environment/environment';

export interface MpesaPaymentRequest {
  phone: string;
  amount: number;
  account_reference: string;
  transaction_desc: string;
}

export interface MpesaPaymentResponse {
  success: boolean;
  message: string;
  data?: {
    MerchantRequestID: string;
    CheckoutRequestID: string;
    ResponseCode: string;
    ResponseDescription: string;
    CustomerMessage: string;
  };
  error?: any;
}

export interface PaymentStatus {
  success: boolean;
  data?: {
    ResponseCode: string;
    ResponseDescription: string;
    MerchantRequestID: string;
    CheckoutRequestID: string;
    ResultCode: string;
    ResultDesc: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = environment.apiUrl || 'http://localhost:3000';
  private paymentStatusSubject = new BehaviorSubject<string>('idle');

  paymentStatus$ = this.paymentStatusSubject.asObservable();

  constructor(private http: HttpClient) {}

  initiatePayment(
    paymentData: MpesaPaymentRequest
  ): Observable<MpesaPaymentResponse> {
    this.paymentStatusSubject.next('processing');
    return this.http.post<MpesaPaymentResponse>(
      `${this.apiUrl}/mpesa/stkpush`,
      paymentData
    );
  }

  checkPaymentStatus(checkoutRequestID: string): Observable<PaymentStatus> {
    return this.http.post<PaymentStatus>(`${this.apiUrl}/mpesa/status`, {
      checkoutRequestID,
    });
  }

  updatePaymentStatus(status: string): void {
    this.paymentStatusSubject.next(status);
  }

  formatPhoneNumber(phone: string): string {
    // Remove any non-digit characters
    let cleaned = phone.replace(/\D/g, '');

    // Handle different phone number formats
    if (cleaned.startsWith('0')) {
      cleaned = '254' + cleaned.substring(1);
    } else if (cleaned.startsWith('7') || cleaned.startsWith('1')) {
      cleaned = '254' + cleaned;
    } else if (!cleaned.startsWith('254')) {
      cleaned = '254' + cleaned;
    }

    return cleaned;
  }
}
