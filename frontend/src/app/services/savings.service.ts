import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SavingsService {
  private apiUrl = 'http://localhost:3000/income'; // Base URL for income API
  private currentSavingsSubject = new BehaviorSubject<number>(0);
  currentSavings$ = this.currentSavingsSubject.asObservable();

  private currentIncomeSubject = new BehaviorSubject<number>(0);
  currentIncome$ = this.currentIncomeSubject.asObservable();

  constructor(private http: HttpClient) {}

  updateSavings(newSavings: number): void {
    this.currentSavingsSubject.next(newSavings);
  }

  getCurrentSavings(): number {
    return this.currentSavingsSubject.getValue();
  }

  // Fetch the total income for the current month
  fetchTotalIncomeForCurrentMonth(): Observable<number> {
    return this.http
      .get<{ totalIncome: number }>(`${this.apiUrl}/TotalIncomeCurrentMonth`)
      .pipe(
        map((response) => {
          this.currentIncomeSubject.next(response.totalIncome);
          return response.totalIncome;
        })
      );
  }

  getCurrentIncome(): number {
    return this.currentIncomeSubject.getValue();
  }

  // Fetch all income data
  fetchAllIncome(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/All`);
  }

  // Add a new income
  addIncome(value: number, date: string): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/Add', { value, date }).pipe(
      map((response) => {
        // Optionally update the current income subject if needed
        this.fetchTotalIncomeForCurrentMonth().subscribe();
        return response;
      })
    );
  }

  // Method to get monthly income data (placeholder replaced with backend data)
  fetchMonthlyIncomeData(): Observable<number[]> {
    return this.fetchAllIncome().pipe(
      map((incomes) => {
        const monthlyData = new Array(12).fill(0);
        incomes.forEach((income) => {
          const incomeDate = new Date(income.date);
          const month = incomeDate.getMonth();
          monthlyData[month] += income.value;
        });
        return monthlyData;
      })
    );
  }
}
