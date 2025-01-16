import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-profile',
  standalone: true,  // Standalone component flag
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [FormsModule, CommonModule]  // Import CommonModule to use ngClass and other common directives
})
export class ProfileComponent {
  // Variables to hold user data
  username: string = 'John Doe';
  email: string = 'john.doe@example.com';
  password: string = 'password123';
  passwordVisible: boolean = false; // Flag for password visibility

  // Flags to toggle edit mode
  isEditMode: boolean = false;

  // Method to toggle the visibility of the password
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  // Method to enable the edit mode
  editProfile(): void {
    this.isEditMode = !this.isEditMode; // Toggle edit mode on/off
  }

  // Method to save the updated user details
  updateProfile(): void {
    // Here you can send the updated values to the server (e.g., API call)
    console.log('Profile updated:', {
      username: this.username,
      email: this.email,
      password: this.password,
    });

    // After saving, turn off the edit mode
    this.isEditMode = false;
    alert('Profile updated successfully!');
  }
}




