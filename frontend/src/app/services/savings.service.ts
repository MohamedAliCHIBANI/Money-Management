import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SavingsService {
  private currentSavingsSubject = new BehaviorSubject<number>(0);
  currentSavings$ = this.currentSavingsSubject.asObservable();

  private currentIncomeSubject = new BehaviorSubject<number>(0);
  currentIncome$ = this.currentIncomeSubject.asObservable();

  constructor() {}

  updateSavings(newSavings: number): void {
    this.currentSavingsSubject.next(newSavings);
  }

  getCurrentSavings(): number {
    return this.currentSavingsSubject.getValue();
  }

  updateIncome(newIncome: number): void {
    this.currentIncomeSubject.next(newIncome);
  }

  getCurrentIncome(): number {
    return this.currentIncomeSubject.getValue();
  }

  // Method to get monthly income data
  getMonthlyIncomeData(): number[] {
    // Placeholder data for demonstration
    return [this.getCurrentIncome(), 1200, 1100, 1300, 1250, 1400, 1350, 1500, 1450, 1600, 1550, 1700];
  }
}