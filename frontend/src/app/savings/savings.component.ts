import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SavingsService } from '../services/savings.service';
import { ExpenseService } from '../services/expenses.service'; // Assure-toi que le chemin est correct
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
  incomeData: number[] = [];

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

    // Fetch monthly income data from the service
    this.savingsService.fetchMonthlyIncomeData().subscribe(
      (data: number[]) => {
        this.incomeData = data;
      },
      (error) => {
        console.error('Error fetching monthly income data:', error);
      }
    );

    // Fetch the current income from the service
    this.savingsService.fetchTotalIncomeForCurrentMonth().subscribe(
      (income: number) => {
        this.monthlyIncome = income;
      },
      (error) => {
        console.error('Error fetching total income for current month:', error);
      }
    );
    this.calculateRemainingBudget();
    // Fetch monthly expenses from the service
    this.loadTotalExpenses();
    this.calculateBudget();
    
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
      const newIncome = this.incomeForm.value.income;
      const currentDate = new Date().toISOString();

      this.savingsService.addIncome(newIncome, currentDate).subscribe(
        (response) => {
          this.monthlyIncome = newIncome; // Set the income
          this.calculateBudget();
          this.incomeForm.reset();
        },
        (error) => {
          console.error('Error adding income:', error);
        }
      );
    }
  }

  addIncome(): void {
    const additionalIncome = this.incomeForm.value.income;
    if (additionalIncome > 0) {
      const updatedIncome = this.monthlyIncome + additionalIncome;
      const currentDate = new Date().toISOString();

      this.savingsService.addIncome(additionalIncome, currentDate).subscribe(
        (response) => {
          this.monthlyIncome = updatedIncome; // Update the cumulative income
          this.calculateRemainingBudget();
          this.incomeForm.reset();
        },
        (error) => {
          console.error('Error adding additional income:', error);
        }
      );
    }
  }

  onSetBudget(): void {
    if (this.budgetForm.valid) {
      this.calculateBudget();
      this.budgetForm.reset();
    }
  }

  calculateBudget(): void {
    this.monthlyBudget = this.monthlyIncome - this.monthlyExpenses - this.currentSavings;
  }

  loadTotalExpenses(): void {
    this.expenseService.getTotalExpenses().subscribe(
      (data: any) => {
        this.monthlyExpenses = data.totalAmount;
      },
      (error: any) => {
        console.error('Error fetching total expenses:', error);
      }
    );
  }

calculateRemainingBudget(): void {
  this.monthlyBudget = this.monthlyIncome - this.monthlyExpenses - this.currentSavings;
}
}
