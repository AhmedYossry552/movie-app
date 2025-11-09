import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService, NotificationService } from '../../../core/services';
import { LoginCredentials } from '../../../core/models/user.model';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  credentials: LoginCredentials = {
    email: '',
    password: ''
  };

  loading = signal(false);

  onSubmit(): void {
    this.loading.set(true);
    
    const result = this.authService.login(this.credentials);
    
    this.loading.set(false);

    if (result.success) {
      this.notificationService.success('Welcome back!');
      
      // Redirect to return URL or home
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/movies';
      this.router.navigate([returnUrl]);
    } else {
      this.notificationService.error(result.message || 'Login failed');
    }
  }
}
