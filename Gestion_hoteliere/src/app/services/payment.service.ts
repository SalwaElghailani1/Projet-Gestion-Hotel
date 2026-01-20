// payment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private paiementUrl = 'http://paiement-service:8090/paiements/';

  constructor(private http: HttpClient) {}

  processPayment(paymentData: any): Observable<any> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(this.paiementUrl, paymentData, { headers });
  }

  updateReservationStatus(reservationId: number, status: string): Observable<any> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.put(
      `http://localhost:3000/api/reservations/${reservationId}/status`,
      { statut: status },
      { headers }
    );
  }
}
