import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ExpenseService } from '../services/expenses.service';
import { Expense } from '../models/expense.model';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Category {
  id: number;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule],
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css'],
})
export class ExpensesComponent implements OnInit {
  categories: Category[] = [
    { id: 1, name: 'Food', icon: 'fas fa-utensils' },
    { id: 2, name: 'Housing', icon: 'fas fa-home' },
    { id: 3, name: 'Utilities', icon: 'fas fa-lightbulb' },
    { id: 4, name: 'Transport', icon: 'fas fa-car' },
  ];

  expenseForm: FormGroup;
  expenses$: Observable<Expense[]>;

  constructor(private fb: FormBuilder, private expenseService: ExpenseService) {
    this.expenseForm = this.fb.group({
      category: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      description: ['', Validators.required],
      date: [new Date().toISOString().split('T')[0], Validators.required], // Set today's date as default
    });

    this.expenses$ = this.expenseService.getAllDepenses();
  }

  ngOnInit() {
    this.loadExpenses();
  }

  loadExpenses() {
    this.expenses$ = this.expenseService.getAllDepenses();
  }

  addExpense() {
    if (this.expenseForm.valid) {
      const formValue = this.expenseForm.value;
      
      const newExpense: Expense = {
        category: formValue.category,
        amount: Number(formValue.amount), // Convert to number properly
        description: formValue.description,
        date: new Date(formValue.date).toISOString(),
      };

      this.expenseService.addExpense(newExpense).subscribe({
        next: () => {
          this.expenseForm.reset({
            date: new Date().toISOString().split('T')[0], // Reset with today's date
            category: '',
            amount: null,
            description: '',
          });
          this.loadExpenses();
        },
        error: (error) => {
          console.error('Error adding expense:', error);
          // Here you might want to add user feedback for the error
        }
      });
    }
  }

  selectCategory(category: Category) {
    this.expenseForm.patchValue({
      category: category.name
    });
  }

  getCategoryIcon(categoryName: string): string {
    const category = this.categories.find((cat) => cat.name === categoryName);
    return category?.icon ?? 'fas fa-question'; // Default icon if category not found
  }

  getSelectedCategoryName(): string {
    return this.expenseForm.get('category')?.value ?? '';
  }
}