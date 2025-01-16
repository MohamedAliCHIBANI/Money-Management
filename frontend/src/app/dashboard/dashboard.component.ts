import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Chart, ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
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
    responsive: false,
    maintainAspectRatio: false
  };

  public lineChartLegend = true;

  public apexChartOptions: any = {
    series: [],
    chart: {
      type: 'line'
    },
    xaxis: {
      categories: []
    },
    dataLabels: {
      enabled: false
    },
    grid: {
      show: false
    },
    stroke: {
      curve: 'smooth'
    },
    title: {
      text: 'Line Chart'
    },
    markers: {
      size: 0
    },
    yaxis: {
      title: {
        text: 'Values'
      }
    },
    fill: {
      opacity: 0
    }
  };

  // Static donut chart configuration
  public donutChartData: ChartConfiguration['data'] = {
    labels: ['Food', 'Housing', 'Utilities', 'Transport'],
    datasets: [
      {
        data: [300, 500, 100, 200],
        backgroundColor: ['#4caf50', '#ffeb3b', '#f44336', '#2196f3'],
        hoverBackgroundColor: ['#4caf50', '#ffeb3b', '#f44336', '#2196f3']
      }
    ]
  };

  public donutChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };

  public donutChartType: ChartType = 'doughnut';

  public callHistory: { name: string, time: string, type: string }[] = [
    { name: 'John Doe', time: '10:30 AM', type: 'Incoming' },
    { name: 'Jane Smith', time: '11:00 AM', type: 'Outgoing' },
    { name: 'Michael Brown', time: '12:15 PM', type: 'Missed' }
  ];
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

  constructor(private router: Router, private expenseService: ExpenseService, private savingsService: SavingsService) {}

  ngOnInit(): void {
    this.loadTotalExpenses();
    this.totalSavings = this.savingsService.getCurrentSavings();
    this.totalIncome = this.savingsService.getCurrentIncome();
    this.calculateTotalBalance();
    this.updateLineChartData();
    this.updateRecentExpenses();
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

      const incomeData = this.savingsService.getMonthlyIncomeData();
      incomeData.forEach((income, index) => {
        monthlyIncome[index] = income;
      });

      this.lineChartData.datasets[0].data = monthlyIncome;
      this.lineChartData.datasets[1].data = monthlyExpenses;
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
