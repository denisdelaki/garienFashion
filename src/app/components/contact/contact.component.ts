import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { Subscription } from 'rxjs';

interface ContactMessage {
  id?: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt?: Date;
  status?: 'pending' | 'responded' | 'resolved';
}

interface FAQ {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatExpansionModule,
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit, OnDestroy {
  contactForm: FormGroup;
  isSubmitting = false;

  private subscriptions = new Subscription();

  faqs: FAQ[] = [
    {
      question: 'How long does custom tailoring take?',
      answer:
        'Custom tailoring typically takes 7-14 business days depending on the complexity of the design and current workload. Rush orders can be accommodated for an additional fee.',
    },
    {
      question: 'Do you offer alterations for clothes bought elsewhere?',
      answer:
        'Yes, we provide alteration services for garments purchased from other stores. Please bring the item to our boutique for assessment and pricing.',
    },
    {
      question: 'What is your return policy?',
      answer:
        'We offer a 30-day return policy for retail items in original condition with tags attached. Custom-made items are non-returnable unless there is a manufacturing defect.',
    },
    {
      question: 'Do you deliver outside Nairobi?',
      answer:
        'Yes, we deliver nationwide across Kenya. Delivery fees vary based on location and are calculated at checkout.',
    },
    {
      question: 'Can I schedule a fitting appointment?',
      answer:
        'Absolutely! We recommend scheduling appointments for fittings to ensure personalized attention. You can call us or use our online booking system.',
    },
    {
      question: 'Do you offer wholesale pricing?',
      answer:
        'Yes, we offer wholesale pricing for bulk orders. Please contact us directly to discuss your requirements and pricing.',
    },
  ];

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {
    this.contactForm = this.createContactForm();
  }

  ngOnInit(): void {
    this.setupFormValidation();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private createContactForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [
        '',
        [Validators.required, Validators.pattern(/^(\+254|0)[17]\d{8}$/)],
      ],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  private setupFormValidation(): void {
    // Add custom validation messages or additional validators if needed
    const phoneControl = this.contactForm.get('phone');
    if (phoneControl) {
      phoneControl.setValidators([
        Validators.required,
        Validators.pattern(/^(\+254|0)[17]\d{8}$/),
      ]);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.contactForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      try {
        const formData: ContactMessage = {
          ...this.contactForm.value,
          id: Date.now(),
          createdAt: new Date(),
          status: 'pending',
        };

        // Simulate API call - replace with actual service call
        await this.submitContactMessage(formData);

        this.showSuccessMessage();
        this.contactForm.reset();
      } catch (error) {
        this.showErrorMessage();
        console.error('Error submitting contact form:', error);
      } finally {
        this.isSubmitting = false;
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private async submitContactMessage(message: ContactMessage): Promise<void> {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // Store in localStorage for demo purposes
        // In a real app, this would be sent to your backend API
        const existingMessages = JSON.parse(
          localStorage.getItem('contactMessages') || '[]'
        );
        existingMessages.push(message);
        localStorage.setItem(
          'contactMessages',
          JSON.stringify(existingMessages)
        );

        console.log('Contact message submitted:', message);
        resolve();
      }, 2000);
    });
  }

  private showSuccessMessage(): void {
    this.snackBar.open(
      "Thank you for your message! We'll get back to you within 24 hours.",
      'Close',
      {
        duration: 5000,
        panelClass: ['success-snackbar'],
      }
    );
  }

  private showErrorMessage(): void {
    this.snackBar.open(
      'Sorry, there was an error sending your message. Please try again.',
      'Close',
      {
        duration: 5000,
        panelClass: ['error-snackbar'],
      }
    );
  }

  private markFormGroupTouched(): void {
    Object.keys(this.contactForm.controls).forEach((key) => {
      const control = this.contactForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  // Helper methods for template
  getErrorMessage(fieldName: string): string {
    const control = this.contactForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${this.getFieldDisplayName(fieldName)} is required`;
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength']?.requiredLength;
      return `${this.getFieldDisplayName(
        fieldName
      )} must be at least ${minLength} characters`;
    }
    if (control?.hasError('pattern') && fieldName === 'phone') {
      return 'Please enter a valid Kenyan phone number';
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      name: 'Name',
      email: 'Email',
      phone: 'Phone number',
      subject: 'Subject',
      message: 'Message',
    };
    return displayNames[fieldName] || fieldName;
  }

  // Method to handle social media links
  openSocialLink(platform: string): void {
    const socialLinks: { [key: string]: string } = {
      facebook: 'https://facebook.com/garienfashion',
      instagram: 'https://instagram.com/garienfashion',
      twitter: 'https://twitter.com/garienfashion',
      whatsapp: 'https://wa.me/254700000000',
    };

    if (socialLinks[platform]) {
      window.open(socialLinks[platform], '_blank');
    }
  }

  // Method to handle phone calls
  makePhoneCall(phoneNumber: string): void {
    window.location.href = `tel:${phoneNumber}`;
  }

  // Method to handle email
  sendEmail(email: string): void {
    window.location.href = `mailto:${email}`;
  }

  // Method to open maps
  openMaps(): void {
    const address = encodeURIComponent('123 Fashion Street, Nairobi, Kenya');
    window.open(`https://maps.google.com/maps?q=${address}`, '_blank');
  }
}
