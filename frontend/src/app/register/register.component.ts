import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [FormsModule],
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  cardType: string = '';
  cardNumber: string = '';
  expireDate: string = '';
  currency: string = '';
  status: string = 'Active'; // Default value for status

  constructor(private router: Router, private http: HttpClient) {}

  onRegister(): void {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const userData = {
      username: this.username,
      password: this.password,
      status: this.status,
      card: {
        cardType: this.cardType,
        cardNumber: this.cardNumber,
        expireDate: this.expireDate,
        currency: this.currency,
      },
    };
this.http.post(`${environment.apiUrl}/user/add`, userData).subscribe(
  (response) => {
    alert('Registration successful!');
    this.router.navigate(['/login']);
  },
  (error) => {
    console.error(error);
    alert('An error occurred during registration.');
  }
);
  }
  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
