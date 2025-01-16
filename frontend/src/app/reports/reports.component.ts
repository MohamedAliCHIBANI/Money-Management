import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { SavingsService } from '../services/savings.service';
import { ExpenseService } from '../services/expenses.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit {
  chart!: Chart;
  savingsAmount: number = 0;
  expensesByCategory: { category: string; amount: number }[] = [];
  private expensesSubject = new BehaviorSubject<{ category: string; amount: number }[]>([]);

  constructor(private savingsService: SavingsService, private expenseService: ExpenseService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    // Subscribe to the savings data from the service
    this.savingsService.currentSavings$.subscribe((savings) => {
      this.savingsAmount = savings;
      this.updateSavingsInChart();
    });

    // Get expenses by category from the service
    this.updateExpensesByCategory();

    // Create the chart after fetching the expenses
    this.createPieChart();

    // Subscribe to the expenses subject to update the chart
    this.expensesSubject.subscribe((expenses) => {
      this.expensesByCategory = expenses;
      if (this.chart) {
        this.chart.data.labels = this.expensesByCategory.map((item) => item.category);
        this.chart.data.datasets[0].data = this.expensesByCategory.map((item) => item.amount);
        this.chart.update();
      }
    });
  }

  // Method to update the savings in the chart
  updateSavingsInChart(): void {
    const savingsCategory = this.expensesByCategory.find(
      (category) => category.category === 'Savings'
    );
    if (savingsCategory) {
      savingsCategory.amount = this.savingsAmount; // Update savings category
    } else {
      this.expensesByCategory.push({ category: 'Savings', amount: this.savingsAmount });
    }

    // Update the expenses subject
    this.expensesSubject.next(this.expensesByCategory);
  }

  // Method to update expenses by category
  updateExpensesByCategory(): void {
    const categories = ['Housing', 'Food', 'Transport', 'Utilities'];
    const expenses: { category: string; amount: number }[] = [];

    categories.forEach((category) => {
      this.expenseService.getTotalAmountByCategory(category).subscribe(
        (data) => {
          expenses.push({ category, amount: data.totalAmount });
          this.expensesSubject.next(expenses); // Update the expenses subject
        },
        (error) => {
          console.error(`Error fetching total amount for category ${category}:`, error);
        }
      );
    });

    // Add savings category
    expenses.push({ category: 'Savings', amount: this.savingsAmount });
    this.expensesSubject.next(expenses); // Update the expenses subject
  }

  createPieChart(): void {
    const canvas = <HTMLCanvasElement>document.getElementById('expensesChart');
    const ctx = canvas?.getContext('2d');

    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: this.expensesByCategory.map((item) => item.category),
          datasets: [
            {
              data: this.expensesByCategory.map((item) => item.amount),
              backgroundColor: [
                '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
              ],
              hoverBackgroundColor: [
                '#FF6384AA', '#36A2EBAA', '#FFCE56AA', '#4BC0C0AA', '#9966FFAA',
              ],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom' },
            tooltip: {
              callbacks: {
                label: (tooltipItem) => {
                  const value = tooltipItem.raw as number;
                  return `${value} $`;
                },
              },
            },
          },
        },
      });
    }
  }
}