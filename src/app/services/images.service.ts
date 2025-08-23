import { Injectable } from '@angular/core';
import { Observable, from, throwError, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { upload } from '@vercel/blob/client';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ImagesService {
  constructor() {}

  uploadImage(file: File): Observable<string> {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return throwError(() => new Error('Please select an image file.'));
    }

    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      return throwError(() => new Error('Image size must be less than 5MB.'));
    }

    return from(
      upload(file.name, file, {
        access: 'public',
        handleUploadUrl: `${environment.apiUrl}/upload`,
      })
    ).pipe(
      switchMap((blob) => of(blob.url)),
      catchError((error) => {
        console.error('Upload failed:', error);
        return throwError(
          () => new Error('Failed to upload image. Please try again.')
        );
      })
    );
  }
}
