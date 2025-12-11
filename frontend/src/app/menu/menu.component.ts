import { Component, EventEmitter, Output } from '@angular/core';
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
  @Output() itemSelected = new EventEmitter<void>();

  constructor(private router: Router) {}

  navigateTo(path: string): void {
    this.router.navigate([path]);
    this.itemSelected.emit();
  }

  onLogout(): void {
    sessionStorage.removeItem('isLoggedIn');
    this.router.navigate(['/login']);
    this.itemSelected.emit();
  }
}


