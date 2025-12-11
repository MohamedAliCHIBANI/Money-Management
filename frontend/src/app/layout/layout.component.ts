import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  imports: [CommonModule, RouterModule, HeaderComponent, MenuComponent] // Import required components
})
export class LayoutComponent implements OnInit {
  menuOpen = true;

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      this.menuOpen = false;
    }
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    if (window.innerWidth <= 768) {
      this.menuOpen = false;
    }
  }
}
