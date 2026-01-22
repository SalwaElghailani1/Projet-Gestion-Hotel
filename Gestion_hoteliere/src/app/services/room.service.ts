import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoomService {


  private apiUrl = 'http://localhost:8093/rooms';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  getRooms(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getRoomById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createRoom(room: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
      'Content-Type': 'application/json'
    });
    return this.http.post(this.apiUrl, room, { headers });
  }

  updateRoom(id: number, room: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
      'Content-Type': 'application/json'
    });
    return this.http.put(`${this.apiUrl}/${id}`, room, { headers });
  }

  deleteRoom(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getHeaders());
  }


  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post('http://localhost:8093/rooms/upload', formData, { responseType: 'text' });
  }


  getRoomByNumero(numero: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/numero/${numero}`);
  }

  getRoomsByType(type: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/type/${type}`);
  }

  getRoomsByPrix(prix: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/prix/${prix}`);
  }



  toggleRoomState(roomId: number, etat: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.patch(
      `http://localhost:8093/rooms/${roomId}/etat/${etat}`,
      {},
      { headers }
    );
  }

  getRoomStats(): Observable<any> {
  return this.http.get(`${this.apiUrl}/stats`, this.getHeaders());
}

}
