// src/app/components/client/client-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Client Dashboard</h1>
        <div class="user-info">
          <span>Welcome, {{ userEmail }}</span>
          <button (click)="logout()" class="logout-btn">Logout</button>
        </div>
      </div>

      <div class="dashboard-content">
        <h2>Your Bookings</h2>
        <div class="bookings-list">
          <p>No bookings yet. Start exploring our rooms and make your first booking!</p>
        </div>

        <div class="actions-section">
          <h2>Quick Actions</h2>
          <div class="action-buttons">
            <button routerLink="/client/bookings" class="action-btn">
              <i class="fas fa-calendar-alt"></i> My Bookings
            </button>
            <button routerLink="/client/profile" class="action-btn">
              <i class="fas fa-user"></i> Profile
            </button>
            <button routerLink="/client/rooms" class="action-btn">
              <i class="fas fa-bed"></i> Browse Rooms
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
      background: #f8f9fa;
      min-height: 100vh;
    }
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #e9ecef;
    }
    .dashboard-header h1 {
      color: #2c3e50;
      margin: 0;
    }
    .user-info {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .logout-btn {
      background: #e74c3c;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
    }
    .dashboard-content h2 {
      color: #2c3e50;
      margin-bottom: 20px;
    }
    .bookings-list {
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      margin-bottom: 30px;
    }
    .actions-section {
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    .action-buttons {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 15px;
    }
    .action-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 12px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-size: 0.95rem;
      transition: opacity 0.3s;
    }
    .action-btn:hover {
      opacity: 0.9;
    }
  `]
})
export class ClientDashboardComponent implements OnInit {
  userEmail = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) this.userEmail = user.email;
  }

  logout() {
    this.authService.logout();
  }
}
