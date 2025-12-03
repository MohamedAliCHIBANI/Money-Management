import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common'; // Import CommonModule
import { UserService } from '../services/user.service';
import { SavingsService } from '../services/savings.service';

@Component({
  selector: 'app-profile',
  standalone: true,  // Standalone component flag
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [FormsModule, CommonModule]  // Import CommonModule to use ngClass and other common directives
})
export class ProfileComponent implements OnInit {
  // Variables to hold user data
  username: string = '';
  status: string = 'Active';
  cardType: string = '';
  cardNumber: string = '';
  expireDate: string = '';
  currency: string = '';
  savings: number = 0;

  passwordVisible: boolean = false; // Flag for password visibility

  // Flags to toggle edit mode
  isEditMode: boolean = false;

  constructor(private userService: UserService, private savingsService: SavingsService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.userService.getProfile().subscribe({
      next: (user) => {
        this.username = user.username || '';
        this.status = user.status || 'Active';
        if (user.card) {
          this.cardType = user.card.cardType || '';
          this.cardNumber = user.card.cardNumber || '';
          this.expireDate = user.card.expireDate || '';
          this.currency = user.card.currency || '';
        }
        this.savings = user.savings || 0;
      },
      error: (err) => {
        console.error('Erreur chargement profil :', err);
      }
    });
  }

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
    const payload: any = {
      username: this.username,
      status: this.status,
      card: {
        cardType: this.cardType,
        cardNumber: this.cardNumber,
        expireDate: this.expireDate,
        currency: this.currency,
      },
      savings: this.savings,
    };
    console.log('Envoi updateProfile payload:', payload);

    // Premièrement, envoyer la mise à jour complète du profil
    this.userService.updateProfile(payload).subscribe({
      next: (updated) => {
        console.log('Réponse updateProfile:', updated);
        // Mettre à jour l'état local et le BehaviorSubject des savings
        this.savingsService.updateSavings(updated.savings || this.savings);
        this.isEditMode = false;
        alert('Profil mis à jour avec succès');

        // Vérifier la persistance en refetchant depuis le serveur
        this.savingsService.fetchSavingsFromServer().subscribe({
          next: (res) => {
            console.log('Verification après update, GET /user/me:', res);
            this.savings = res.savings || this.savings;
            this.savingsService.updateSavings(this.savings);
          },
          error: (err) => console.error('Erreur fetch après update:', err)
        });
      },
      error: (err) => {
        console.error('Erreur mise à jour profil :', err);
        alert('Erreur lors de la mise à jour du profil');
      }
    });
  }
}




