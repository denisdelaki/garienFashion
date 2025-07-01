import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TailoringRequest } from '../models/tailoringRequest.model';

@Injectable({
  providedIn: 'root',
})
export class TailoringService {
  private tailoringRequestsSubject = new BehaviorSubject<TailoringRequest[]>(
    []
  );
  private storageKey = 'tailoringRequests';

  tailoringRequests$: Observable<TailoringRequest[]> =
    this.tailoringRequestsSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadRequestsFromStorage();
    }
  }

  // Submit a new tailoring request
  submitTailoringRequest(
    request: Omit<TailoringRequest, 'id' | 'createdAt' | 'status'>
  ): TailoringRequest {
    const newRequest: TailoringRequest = {
      ...request,
      id: Date.now(),
      createdAt: new Date(),
      status: 'pending',
    };

    const currentRequests = this.tailoringRequestsSubject.value;
    const updatedRequests = [...currentRequests, newRequest];

    this.updateRequests(updatedRequests);
    return newRequest;
  }

  // Get all tailoring requests
  getTailoringRequests(): TailoringRequest[] {
    return this.tailoringRequestsSubject.value;
  }

  // Get request by ID
  getTailoringRequestById(id: number): TailoringRequest | undefined {
    return this.tailoringRequestsSubject.value.find(
      (request) => request.id === id
    );
  }

  // Update request status
  updateRequestStatus(id: number, status: TailoringRequest['status']): boolean {
    const currentRequests = this.tailoringRequestsSubject.value;
    const requestIndex = currentRequests.findIndex(
      (request) => request.id === id
    );

    if (requestIndex !== -1) {
      currentRequests[requestIndex].status = status;
      this.updateRequests([...currentRequests]);
      return true;
    }
    return false;
  }

  // Delete a request
  deleteRequest(id: number): boolean {
    const currentRequests = this.tailoringRequestsSubject.value;
    const filteredRequests = currentRequests.filter(
      (request) => request.id !== id
    );

    if (filteredRequests.length !== currentRequests.length) {
      this.updateRequests(filteredRequests);
      return true;
    }
    return false;
  }

  // Get requests by status
  getRequestsByStatus(status: TailoringRequest['status']): TailoringRequest[] {
    return this.tailoringRequestsSubject.value.filter(
      (request) => request.status === status
    );
  }

  // Get requests by customer email
  getRequestsByEmail(email: string): TailoringRequest[] {
    return this.tailoringRequestsSubject.value.filter(
      (request) => request.email.toLowerCase() === email.toLowerCase()
    );
  }

  // Calculate estimated price based on category, urgency, and budget
  calculateEstimatedPrice(
    category: string,
    urgency: string,
    baseBudget: number
  ): number {
    let multiplier = 1;

    // Category-based pricing
    const categoryMultipliers: { [key: string]: number } = {
      suits: 1.5,
      dresses: 1.3,
      jackets: 1.4,
      traditional: 1.6,
      shirts: 1.0,
      pants: 1.1,
      skirts: 1.0,
    };

    // Urgency-based pricing
    const urgencyMultipliers: { [key: string]: number } = {
      standard: 1.0,
      rush: 1.3,
      express: 1.6,
    };

    multiplier *= categoryMultipliers[category] || 1.0;
    multiplier *= urgencyMultipliers[urgency] || 1.0;

    return Math.round(baseBudget * multiplier);
  }

  // Get popular categories
  getPopularCategories(): { category: string; count: number }[] {
    const requests = this.tailoringRequestsSubject.value;
    const categoryCount: { [key: string]: number } = {};

    requests.forEach((request) => {
      categoryCount[request.category] =
        (categoryCount[request.category] || 0) + 1;
    });

    return Object.entries(categoryCount)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
  }

  // Clear all requests (admin function)
  clearAllRequests(): void {
    this.updateRequests([]);
  }

  private updateRequests(requests: TailoringRequest[]): void {
    this.tailoringRequestsSubject.next(requests);
    this.saveRequestsToStorage(requests);
  }

  private saveRequestsToStorage(requests: TailoringRequest[]): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(requests));
      } catch (error) {
        console.error(
          'Error saving tailoring requests to localStorage:',
          error
        );
      }
    }
  }

  private loadRequestsFromStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const savedRequests = localStorage.getItem(this.storageKey);
        if (savedRequests) {
          const requests: TailoringRequest[] = JSON.parse(savedRequests);
          // Convert date strings back to Date objects
          requests.forEach((request) => {
            if (request.createdAt) {
              request.createdAt = new Date(request.createdAt);
            }
          });
          this.tailoringRequestsSubject.next(requests);
        }
      } catch (error) {
        console.error(
          'Error loading tailoring requests from localStorage:',
          error
        );
      }
    }
  }
}
