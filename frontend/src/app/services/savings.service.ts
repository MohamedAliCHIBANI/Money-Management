
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment'; 

@Injectable({
  providedIn: 'root',
})
export class SavingsService {
  private apiUrl = `${environment.apiUrl}/income`; 
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

  fetchAllIncome(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/All`).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération des revenus:', error);
        return throwError(() => error);
      })
    );
  }

  addIncome(value: number, date: string): Observable<any> {
    const token = sessionStorage.getItem('authToken');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

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

  // Fetch savings from backend (user profile)
  fetchSavingsFromServer(): Observable<any> {
    const token = sessionStorage.getItem('authToken');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<any>(`${this.apiUrl.replace('/income', '/user')}/me`, { headers });
  }

  // Update savings on server
  updateSavingsOnServer(newSavings: number) {
    const token = sessionStorage.getItem('authToken');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.put<any>(`${this.apiUrl.replace('/income', '/user')}/me`, { savings: newSavings }, { headers });
  }
}
