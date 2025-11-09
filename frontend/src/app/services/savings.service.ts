import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class SavingsService {
  private apiUrl = 'http://localhost:3000/income';
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

  // ✅ Total income for the current month
  fetchTotalIncomeForCurrentMonth(): Observable<number> {
    return this.http
      .get<{ totalIncome: number }>(`${this.apiUrl}/TotalIncomeCurrentMonth`)
      .pipe(
        map((response) => {
          this.currentIncomeSubject.next(response.totalIncome);
          return response.totalIncome;
        }),
        catchError((error) => {
          console.error('Erreur lors du fetch du revenu mensuel:', error);
          return throwError(() => error);
        })
      );
  }

  getCurrentIncome(): number {
    return this.currentIncomeSubject.getValue();
  }

  // ✅ Fetch all incomes of the logged-in user
  fetchAllIncome(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/All`).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération des revenus:', error);
        return throwError(() => error);
      })
    );
  }

  // ✅ Add a new income (no need to send user ID)
addIncome(value: number, date: string): Observable<any> {
  // Récupère le token depuis sessionStorage
  const token = sessionStorage.getItem('authToken');

  // Définit le header Authorization
  const headers = { Authorization: `Bearer ${token}` };

  return this.http.post<any>(`${this.apiUrl}/Add`, { value, date }, { headers }).pipe(
    map((response) => {
      console.log('Income ajouté avec succès:', response);
      this.fetchTotalIncomeForCurrentMonth().subscribe();
      return response;
    }),
    catchError((error) => {
      console.error('Erreur lors de l’ajout du revenu:', error);
      return throwError(() => error);
    })
  );
}


  // ✅ Generate monthly data from all incomes
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
      }),
      catchError((error) => {
        console.error('Erreur lors du calcul des revenus mensuels:', error);
        return throwError(() => error);
      })
    );
  }
}
