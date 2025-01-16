import { Component } from '@angular/core';
import { Router } from '@angular/router';  // Import Router

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {

  constructor(private router: Router) {}

  // Method to navigate to the ProfileComponent
  goToProfile(): void {
    this.router.navigate(['/profile']);
  }
}

