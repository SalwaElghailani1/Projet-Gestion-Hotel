import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  private apiUrl = 'http://localhost:8071/v1/user-profiles';

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser$: Observable<any>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<any>(null);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  private getHeaders() {
    const token = localStorage.getItem('token');

    if (!token) {
      console.warn('NO TOKEN FOUND');
    }

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token ?? ''}`
      })
    };
  }

  getMyProfile(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/me`,
      this.getHeaders()
    );
  }

  updateMyProfile(data: any): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}`,
      data,
      this.getHeaders()
    );
  }


  getAllProfiles(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}`,
      this.getHeaders()
    );
  }

  logout() {
    const token = localStorage.getItem('token');

    if (token) {
      this.http.post('http://localhost:8071/v1/user-profiles/logout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe({
        next: () => {
          console.log('Status OUT_WORK updated');
        },
        error: (err) => {
          console.error('Impossible de mettre à jour le status', err);
        }
      });
    }

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);  // ✅ maintenant ma3mrha tsawab
    this.router.navigate(['/login']);     // ✅ redirect
  }


  changeProfileStatus(
    userId: number,
    status: string,
    adminId: number,
    rejectionReason?: string
  ): Observable<any> {

    let url = `${this.apiUrl}/${userId}/status?status=${status}&adminId=${adminId}`;

    if (rejectionReason) {
      url += `&rejectionReason=${rejectionReason}`;
    }

    return this.http.put<any>(
      url,
      {},
      this.getHeaders()
    );
  }
}
