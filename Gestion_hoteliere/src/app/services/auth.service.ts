import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8070/v1';
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser$: Observable<any>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<any>(null);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/login`, { email, password })
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.accessToken);
          localStorage.setItem('user', JSON.stringify({
            email: response.email,
            roles: response.roles
          }));
          this.currentUserSubject.next(response);
        })
      );
  }



  register(firstName: string, lastName: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/register`, {
      firstName,
      lastName,
      email,
      password,
      role: ["CLIENT"] // backend kayforce role CLIENT
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getCurrentUser() {
    return this.currentUserSubject.value;
  }

  getClientProfile() {
    const token = localStorage.getItem('token');
    return this.http.get('http://localhost:8088/clients/me', {
      headers: { Authorization: `Bearer ${token}` } // tzid token hna
    });
  }


  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  refreshToken(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post<any>(`${this.apiUrl}/users/refresh-token`, { token })
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.accessToken);
        })
      );
  }

  updateClientProfile(data: any) {
    const token = localStorage.getItem('token');

    return this.http.put(
      'http://localhost:8088/clients/update',
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }


  // في auth.service.ts
  getUserRole(): string {
    const token = this.getToken();
    if (!token) return '';

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.roles[0] || '';
  }

  hasRole(role: string): boolean {
    const userRole = this.getUserRole();
    return userRole === role || userRole === 'ADMIN';
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.roles?.includes('ADMIN') || false;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserId(): number {
    const token = this.getToken();
    if (!token) return 0;

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId;
  }

  getUserName(): string {
    const token = this.getToken();
    if (!token) return '';

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.prenom + ' ' + payload.nom;
  }

}
