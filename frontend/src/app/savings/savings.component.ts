import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SavingsService } from '../services/savings.service';
import { ExpenseService } from '../services/expenses.service';// Assure-toi que le chemin est correct
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-savings',
  standalone: true,
  templateUrl: './savings.component.html',
  styleUrls: ['./savings.component.css'],
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  providers: [ExpenseService] // Ajoute ExpenseService aux providers
})
export class SavingsComponent implements OnInit {
  savingsForm!: FormGroup;
  incomeForm!: FormGroup;
  budgetForm!: FormGroup;
  savingsGoal: number = 0;
  currentSavings: number = 0;
  addedSavings: number[] = [];
  progress: number = 0;
  monthlyIncome: number = 0;
  monthlyExpenses: number = 0;
  monthlyBudget: number = 0;
  totalExpenses: number = 0;
  totalAmountByCategory: number = 0;

  constructor(private fb: FormBuilder, private savingsService: SavingsService, private expenseService: ExpenseService) {}

  ngOnInit(): void {
    this.savingsForm = this.fb.group({
      goal: ['', [Validators.required, Validators.min(1)]],
      current: ['', [Validators.required, Validators.min(0)]],
    });

    this.incomeForm = this.fb.group({
      income: ['', [Validators.required, Validators.min(1)]],
    });

    this.budgetForm = this.fb.group({
      expenses: ['', [Validators.required, Validators.min(0)]],
    });

    // Récupérer le monthlyIncome depuis le service
    this.monthlyIncome = this.savingsService.getCurrentIncome();

    // Récupérer les dépenses mensuelles depuis le service
    this.loadTotalExpenses();

    // Récupérer le montant total par catégorie (exemple avec la catégorie 'Food')
    this.loadTotalAmountByCategory('Food');
  }

  onSaveGoal(): void {
    if (this.savingsForm.valid) {
      if (this.savingsGoal === 0) {
        this.savingsGoal = this.savingsForm.value.goal;
      }
      this.currentSavings = this.savingsForm.value.current;
      this.savingsService.updateSavings(this.currentSavings);
      this.calculateProgress();
      this.savingsForm.get('current')?.reset();
    }
  }

  addMoreSavings(): void {
    const additionalSavings = this.savingsForm.value.current;
    if (additionalSavings > 0) {
      this.addedSavings.push(additionalSavings);
      this.currentSavings += additionalSavings;
      this.savingsService.updateSavings(this.currentSavings);
      this.calculateProgress();
      this.savingsForm.get('current')?.reset();
    }
  }

  calculateProgress(): void {
    const totalSavings = this.currentSavings;
    const progressPercentage = (totalSavings / this.savingsGoal) * 100;
    this.progress = Math.min(progressPercentage, 100);
  }

  onSetIncome(): void {
    if (this.incomeForm.valid) {
      this.monthlyIncome = this.incomeForm.value.income;
      this.savingsService.updateIncome(this.monthlyIncome); // Mettre à jour le monthlyIncome dans le service
      this.calculateBudget();
      this.incomeForm.reset();
    }
  }

  addIncome(): void {
    const additionalIncome = this.incomeForm.value.income;
    if (additionalIncome > 0) {
      this.monthlyIncome += additionalIncome;
      this.savingsService.updateIncome(this.monthlyIncome); // Mettre à jour le monthlyIncome dans le service
      this.calculateBudget();
      this.incomeForm.reset();
    }
  }

  onSetBudget(): void {
    if (this.budgetForm.valid) {
      
      this.calculateBudget();
      this.budgetForm.reset();
    }
  }

  calculateBudget(): void {
    this.monthlyBudget = this.monthlyIncome - this.monthlyExpenses;
  }

  loadTotalExpenses(): void {
    this.expenseService.getTotalExpenses().subscribe(
      (data: any) => { // Déclare explicitement le type
        this.monthlyExpenses = data.totalAmount;
      },
      (error: any) => { // Déclare explicitement le type
        console.error('Error fetching total expenses:', error);
      }
    );
  }

  loadTotalAmountByCategory(category: string): void {
    this.expenseService.getTotalAmountByCategory(category).subscribe(
      (data: any) => { // Déclare explicitement le type
        this.totalAmountByCategory = data.totalAmount;
      },
      (error: any) => { // Déclare explicitement le type
        console.error(`Error fetching total amount for category ${category}:`, error);
      }
    );
  }
}