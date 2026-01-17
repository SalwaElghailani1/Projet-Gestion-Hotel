// housekeeping.service.ts - MODIFIÉ
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Room {
  id: number;
  numero: string;
  type: string;
  prix: number;
  etat: string;
  description?: string;
  image?: string;
  taux?: number;
  lit_long?: number;
  lit_large?: number;
}

export interface Task {
  id?: number;
  chambreId: number;
  description: string;
  status: string;
  assignedTo: number;
  createdAt?: string;
  priority?: 'low' | 'medium' | 'high';
}

@Injectable({
  providedIn: 'root'
})
export class HousekeepingService {

  private apiUrl = 'http://localhost:8093'; // Même port que RoomService

  constructor(private http: HttpClient) {}

  // ROOMS - Utilisez les mêmes endpoints que RoomService
  getAllRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/rooms`);
  }

  updateRoomStatus(roomId: number, status: string): Observable<Room> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token || ''}`,
      'Content-Type': 'application/json'
    });

    return this.http.put<Room>(
      `${this.apiUrl}/rooms/${roomId}/status`,
      { etat: status }, // Assurez-vous que c'est le bon nom de champ
      { headers }
    );
  }

  // TASKS
  getMyTasks(userId: number): Observable<Task[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token || ''}`
    });

    return this.http.get<Task[]>(`${this.apiUrl}/tasks/user/${userId}`, { headers });
  }

  createTask(task: Task): Observable<Task> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token || ''}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<Task>(`${this.apiUrl}/tasks`, task, { headers });
  }

  updateTaskStatus(taskId: number, status: string): Observable<Task> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token || ''}`,
      'Content-Type': 'application/json'
    });

    return this.http.put<Task>(
      `${this.apiUrl}/tasks/${taskId}/status`,
      { status },
      { headers }
    );
  }
}
