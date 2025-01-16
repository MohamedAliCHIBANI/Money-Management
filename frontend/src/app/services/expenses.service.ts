import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private apiUrl = 'http://localhost:3000/Expence'; // Backend route for depenses

  constructor(private http: HttpClient) {}

  addExpense(expense: { amount: number, date: string, category: string, description: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/ajout', expense).pipe(
      catchError(error => {
        console.error('Erreur lors de l\'ajout de la dépense:', error);
        return throwError(error);
      })
    );
  }

  getAllDepenses(): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/all').pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des dépenses:', error);
        return throwError(error);
      })
    );
  }

  getTotalAmountByCategory(category: string): Observable<any> {
    console.log(`Fetching total amount for category: ${category}`); // Ajoute cette ligne
    return this.http.get<any>(`${this.apiUrl}/totalAmount/${category}`).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération du montant total par catégorie:', error);
        return throwError(error);
      })
    );
  }

  getTotalExpenses(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/totalExpenses`).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération du montant total des dépenses:', error);
        return throwError(error);
      })
    );
  }
}