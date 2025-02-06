import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { RegisterComponent } from '../register/register.component'; // Import the RegisterComponent

@Component({
  selector: 'app-login',
  standalone: true,  // Standalone component flag
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, RouterModule]  // Import FormsModule to use ngModel
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  onLogin(): void {
    // Send credentials to backend to get the token
    this.http.post<any>('http://localhost:3000/user/login', { username: this.username, password: this.password }).subscribe(
      (response) => {
        // Save the token in sessionStorage (or localStorage)
        sessionStorage.setItem('authToken', response.token);

        // Set login status and navigate
        sessionStorage.setItem('isLoggedIn', 'true');
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        alert('Invalid credentials');
      }
    );
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
