import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, NotificationService } from '../../../core/services';
import { RegisterData } from '../../../core/models/user.model';


@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  formData: RegisterData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  loading = signal(false);

  onSubmit(): void {
    this.loading.set(true);
    
    const result = this.authService.register(this.formData);
    
    this.loading.set(false);

    if (result.success) {
      this.notificationService.success('Account created successfully!');
      this.router.navigate(['/movies']);
    } else {
      this.notificationService.error(result.message || 'Registration failed');
    }
  }
}
