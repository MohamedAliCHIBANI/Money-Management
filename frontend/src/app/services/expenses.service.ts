import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment'; // 👈 ajout

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private apiUrl = `${environment.apiUrl}/Expence`; // 👈 basé sur env

  constructor(private http: HttpClient) {}

  addExpense(expense: { amount: number; date: string; category: string; description: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/ajout`, expense).pipe(
      catchError((error) => {
        console.error('Erreur lors de l’ajout de la dépense:', error);
        return throwError(() => error);
      })
    );
  }

  getAllDepenses(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/all`).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération des dépenses:', error);
        return throwError(() => error);
      })
    );
  }

  getTotalAmountByCategory(category: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/totalAmount/${category}`).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération du total par catégorie:', error);
        return throwError(() => error);
      })
    );
  }

  getTotalExpenses(): Observable<any> {
    const token = sessionStorage.getItem('authToken');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.get<any>(`${this.apiUrl}/totalExpenses`, { headers }).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération du total des dépenses:', error);
        return throwError(() => error);
      })
    );
  }
}
