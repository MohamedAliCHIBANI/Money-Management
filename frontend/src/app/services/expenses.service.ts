import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';



@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private apiUrl = 'http://localhost:3000/Expence'; // Backend route for expenses

  constructor(private http: HttpClient) {}

  addExpense(expense: { amount: number; date: string; category: string; description: string }): Observable<any> {
    // Le backend lit l'utilisateur depuis le token, donc pas besoin d'ajouter `user`
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
    // 🔹 Récupérer le token du sessionStorage
    const token = sessionStorage.getItem('authToken');

    // 🔹 Créer les headers avec le token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // 🔹 Envoyer la requête avec les headers
    return this.http.get<any>(`${this.apiUrl}/totalExpenses`, { headers }).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération du total des dépenses:', error);
        return throwError(() => error);
      })
    );
  }
}
