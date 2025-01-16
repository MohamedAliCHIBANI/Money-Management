import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { RegisterComponent } from '../register/register.component'; // Import the RegisterComponent

@Component({
  selector: 'app-login',
  standalone: true,  // Standalone component flag
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule,RegisterComponent]  // Import FormsModule to use ngModel
})
export class LoginComponent {

  username: string = '';
  password: string = '';

  constructor(private router: Router) {}

  onLogin(): void {
    if (this.username === 'user' && this.password === 'user') {
      sessionStorage.setItem('isLoggedIn', 'true'); // Set login status
      this.router.navigate(['/dashboard']); // Redirect to dashboard on success
    } else {
      alert('Invalid credentials');
    }
  }
  navigateTo(path: string): void {
    this.router.navigate([path]); // Navigate to the selected path
  }
}






