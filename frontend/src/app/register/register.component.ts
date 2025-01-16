import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true, // Standalone component
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [FormsModule],
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private router: Router) {}

  onRegister(): void {
    if (this.password === this.confirmPassword) {
      alert('Registration successful!');
      this.router.navigate(['/login']); // Redirect to login page after registration
    } else {
      alert('Passwords do not match!');
    }
  }
}
