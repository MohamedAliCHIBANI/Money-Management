import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';
import { CommonModule } from '@angular/common'; 
import { RegisterComponent } from './register/register.component';

@Component({
  selector: 'app-root',
  standalone: true,  // Marking the component as standalone
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterModule, LayoutComponent, LoginComponent, CommonModule, RegisterComponent] // Import the required components
 // Import the required components
})
export class AppComponent {
  title = 'money-manager';

  // Check if the user is logged in using sessionStorage
  isLoggedIn(): boolean {
    // Ensure sessionStorage is only accessed in the browser
    if (typeof window !== 'undefined' && window.sessionStorage) {
      return sessionStorage.getItem('isLoggedIn') === 'true'; // Check login status
    }
    return false; // Default value if sessionStorage is not available
  }
}


