import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
<<<<<<< HEAD
  showPassword = false;
=======
>>>>>>> aae88ef2ebca9e5791e21fb65dcd26a6bc2be000

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
<<<<<<< HEAD
  ) {
    // Auto-login: if already authenticated and session is valid, go to dashboard
    if (localStorage.getItem('isAuthenticated') === 'true' && !this.authService.isSessionExpired()) {
      this.router.navigate(['/dashboard']);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
=======
  ) { }
>>>>>>> aae88ef2ebca9e5791e21fb65dcd26a6bc2be000

  onSubmit(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter both username and password';
      return;
    }

    this.authService.login(this.username, this.password).subscribe({
      next: (res) => {
        this.toastService.success(`Welcome back, ${res.name}!`);
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.toastService.error('Invalid credentials');
      }
    });
  }
}
