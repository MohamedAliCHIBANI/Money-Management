import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  imports: [CommonModule]
})
export class MenuComponent {
  constructor(private router: Router) {}

  navigateTo(path: string): void {
    this.router.navigate([path]); // Navigate to the selected path
  }

  onLogout(): void {
    sessionStorage.removeItem('isLoggedIn'); // Remove login status on logout
    this.router.navigate(['/login']); // Redirect to login
  }
}


