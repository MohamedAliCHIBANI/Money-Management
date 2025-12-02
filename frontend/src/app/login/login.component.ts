import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { RegisterComponent } from '../register/register.component'; // Import the RegisterComponent
import { environment } from '../../environments/environment';


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
    this.http.post<any>(`${environment.apiUrl}/user/login`, {
  username: this.username,
  password: this.password
}).subscribe(
  (response) => {
    // Sauvegarde du token
    sessionStorage.setItem('authToken', response.token);
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