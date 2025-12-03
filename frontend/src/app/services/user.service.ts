import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) {}

  private authHeaders() {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('authToken') : '';
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  getProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me`, this.authHeaders());
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/me`, data, this.authHeaders());
  }
}
