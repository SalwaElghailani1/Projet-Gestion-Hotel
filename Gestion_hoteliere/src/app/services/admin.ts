import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  pendingProfiles: number;
  totalRoles: number;
  recentActivities: Activity[];
}

export interface Activity {
  id: number;
  action: string;
  userId: number;
  userEmail: string;
  timestamp: Date;
  details: string;
}

export interface AuditLog {
  id: number;
  action: string;
  entityType: string;
  entityId: number;
  performedBy: number;
  performedByEmail: string;
  timestamp: Date;
  changes: any;
  ipAddress: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8070/v1/admin';

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.apiUrl}/stats`);
  }

  getAuditLogs(page: number = 0, size: number = 20): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(`${this.apiUrl}/audit-logs`, {
      params: { page: page.toString(), size: size.toString() }
    });
  }

  exportUsers(format: 'csv' | 'excel' | 'pdf'): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export/users`, {
      params: { format },
      responseType: 'blob'
    });
  }

  bulkUpdateUserStatus(userIds: number[], active: boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/bulk-status`, {
      userIds,
      active
    });
  }

  sendBulkNotification(userIds: number[], message: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/notifications/bulk`, {
      userIds,
      message
    });
  }

  getSystemHealth(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`);
  }
}