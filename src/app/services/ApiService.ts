import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://localhost:7137/api';
  
  constructor(private http: HttpClient) { }
  
  // HTTP Headers
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }
  
  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
  
  login(loginObj: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Account/Login`, loginObj)
      .pipe(
        tap((res: any) => {
          if (res && res.data && res.data.token) {
            localStorage.setItem('token', res.data.token);
          }
        }),
        catchError(this.handleError)
      );
  }
  
  getAllBusinessCards(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/BusinessCard/GetAll`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteBusinessCard(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/BusinessCard/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }
}