import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
// import { environment } from '../../environments/environment'; // Removed for compilation
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

// Mock environment for compilation. 
// Please ensure the import path for your environment file is correct in your project.
const environment = {
  apiUrl: '/api' // Using a relative path as a fallback
};

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private apiUrl = `${environment.apiUrl}/Expence`;

  constructor(
    private http: HttpClient, 
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // Services don't have ngOnInit, so the method was removed.
  // If you need code to run on initialization, put it in the constructor
  // (but be careful of SSR-sensitive code!)

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
    // We use isPlatformBrowser, which is the Angular-standard way.
    if (isPlatformBrowser(this.platformId)) {
      const token = sessionStorage.getItem('token'); // Safe: only runs in browser
      const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

      return this.http.get<any>(`${this.apiUrl}/totalExpenses`, { headers }).pipe(
        catchError((error) => {
          console.error('Erreur lors de la récupération du total des dépenses:', error);
          return throwError(() => error);
        })
      );
    } else {
      // Running on the server.
      return of(null);
    }
  }
}