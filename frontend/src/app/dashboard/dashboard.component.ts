import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Chart, ChartConfiguration, ChartOptions, ChartType, registerables } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { Router } from '@angular/router';
import { ExpenseService } from '../services/expenses.service';
import { SavingsService } from '../services/savings.service';
import { Expense } from '../models/expense.model';
import { HttpClientModule } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgChartsModule, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardComponent implements OnInit {
  title = 'ng2-charts-demo';

  // Décommenter et utiliser ces configurations pour le graphique en ligne
  public lineChartData: ChartConfiguration['data'] = {
    labels: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    datasets: [
      {
        data: [],
        label: 'Income',
        fill: true,
        tension: 0.5,
        borderColor: '#28e915',
        backgroundColor: 'rgba(128, 179, 146, 0.3)'
      },
      {
        data: [],
        label: 'Expenses',
        fill: true,
        tension: 0.5,
        borderColor: '#e53142',
        backgroundColor: 'rgba(238, 226, 226, 0.3)'
      }
    ]
  };

  public lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };

  public lineChartLegend = true;

  // Méthode pour créer le graphique en ligne
  createlinechart(): void {
    const canvas = <HTMLCanvasElement>document.getElementById('EarningFlow');
    const ctx = canvas?.getContext('2d');

    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'line',
        data: this.lineChartData,
        options: this.lineChartOptions
      });
    }
  }

  donutchart!: Chart;
  expensesByCategory: { category: string; amount: number }[] = [];
  private expensesSubject = new BehaviorSubject<{ category: string; amount: number }[]>([]);
  
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
  }

  createDonutchart(): void {
    const canvas = <HTMLCanvasElement>document.getElementById('expensesChart');
    const ctx = canvas?.getContext('2d');

    if (ctx) {
      this.donutchart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: this.expensesByCategory.map((item) => item.category),
          datasets: [
            {
              data: this.expensesByCategory.map((item) => item.amount),
              backgroundColor: [
                '#ffeb3b', '#4caf50', '#2196f3', '#f44336',
              ],
              hoverBackgroundColor: [
                '#ffeb3b', '#4caf50', '#2196f3', '#f44336',
              ],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
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

  public cardDetails: { name: string, type: string }[] = [
    { name: 'status', type: 'Active' },
    { name: 'card ', type: 'credit' },
    { name: 'card Type', type: 'visa' },
    { name: 'card Number', type: '1254652498752458' },
    { name: 'Expire Date', type: '12-12-2026' },
    { name: 'Currency', type: 'BDT' }
  ];

  totalExpenses: number = 0;
  totalSavings: number = 0;
  totalIncome: number = 0;
  totalBalance: number = 0;
  chart!: Chart;

  constructor(private router: Router, private expenseService: ExpenseService, private savingsService: SavingsService) {  
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadTotalExpenses();
    this.totalSavings = this.savingsService.getCurrentSavings();
    this.savingsService.fetchTotalIncomeForCurrentMonth().subscribe(
      (income) => {
        this.totalIncome = income;
        this.calculateTotalBalance();
      },
      (error) => {
        console.error('Error fetching total income for current month:', error);
      }
    );
    this.calculateTotalBalance();
    this.updateLineChartData();
    this.updateRecentExpenses();
    this.updateExpensesByCategory();
    this.createDonutchart();
    this.createlinechart(); // Appeler la méthode pour créer le graphique en ligne
    this.expensesSubject.subscribe((expenses) => {
      this.expensesByCategory = expenses;
      if (this.donutchart) {
        this.donutchart.data.labels = this.expensesByCategory.map((item) => item.category);
        this.donutchart.data.datasets[0].data = this.expensesByCategory.map((item) => item.amount);
        this.donutchart.update();
      }
    });
  }

  calculateTotalBalance(): void {
    this.totalBalance = this.totalIncome - this.totalSavings - this.totalExpenses;
  }

  updateLineChartData(): void {
    const monthlyExpenses: number[] = new Array(12).fill(0);
    const monthlyIncome: number[] = new Array(12).fill(0);

    this.expenseService.getAllDepenses().subscribe(expenses => {
      expenses.forEach((expense: Expense) => {
        const month = new Date(expense.date).getMonth();
        monthlyExpenses[month] += expense.amount;
      });

      this.savingsService.fetchMonthlyIncomeData().subscribe(
        (incomeData: number[]) => {
          incomeData.forEach((income, index) => {
            monthlyIncome[index] = income;
          });

          // Mettre à jour les données du graphique en ligne
          this.lineChartData.datasets[0].data = monthlyIncome;
          this.lineChartData.datasets[1].data = monthlyExpenses;

          // Mettre à jour le graphique en ligne si il existe
          if (this.chart) {
            this.chart.update();
          }
        },
        (error) => {
          console.error('Error fetching monthly income data:', error);
        }
      );
    });
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  recentExpenses: Expense[] = [];
  updateRecentExpenses(): void {
    this.expenseService.getAllDepenses().subscribe(expenses => {
      this.recentExpenses = expenses
        .sort((a: Expense, b: Expense) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3);
    });
  }

  loadTotalExpenses(): void {
    this.expenseService.getTotalExpenses().subscribe(
      (data) => {
        this.totalExpenses = data.totalAmount;
        this.calculateTotalBalance();
      },
      (error) => {
        console.error('Error fetching total expenses:', error);
      }
    );
  }
}