// src/app/admin/admin.ts
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { NgChartsModule } from 'ng2-charts';
import { ChartOptions, ChartData, ChartType } from 'chart.js';
import { filter, Subscription } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { UserProfileService } from '../services/user-profile.service';
import { UserService } from '../services/user.service';

interface RoleStat {
  role: string;
  count: number;
  active: number;
  inactive: number;
  percentage: number;
}

interface MenuItem {
  path: string;
  icon: string;
  label: string;
  exact?: boolean;
  badge?: number;
  tooltip?: string;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  icon: string;
  color: 'primary' | 'accent' | 'warn';
  read: boolean;
  type: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatBadgeModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatDividerModule,
    MatTooltipModule,
    HttpClientModule,
    MatSnackBarModule,
    NgChartsModule
  ],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class Admin implements OnInit, OnDestroy {
  sidenavOpened = true;
  currentRoute = '';
  isMobile = false;

  stats = {
    totalUsers: 0,
    pendingProfiles: 0,
    activeUsers: 0,
    totalRoles: 5,
    todayBookings: 0,
    occupancyRate: 0,
    revenueToday: 0,
    satisfactionRate: 4.8
  };

  user: any;
  loading = false;
  notifications: Notification[] = [];
  lastUpdate = new Date();
  private subscriptions = new Subscription();

  // Graphiques des rôles
  roleStats: RoleStat[] = [];
  roleChartLabels: string[] = [];
  roleChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: []
  };
  
  chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      }
    }
  };

  menuItems: MenuItem[] = [
    { path: '/admin', icon: 'dashboard', label: 'Tableau de bord', exact: true, tooltip: 'Vue d\'ensemble des statistiques' },
    { path: '/admin/users', icon: 'people', label: 'Utilisateurs', badge: 0, tooltip: 'Gestion des utilisateurs' },
    { path: '/admin/roles', icon: 'admin_panel_settings', label: 'Rôles & Permissions', tooltip: 'Gestion des autorisations' },
    { path: '/admin/reservation', icon: 'event_available', label: 'Réservations', badge: 3, tooltip: 'Gestion des réservations' },
    { path: '/admin/room-stats', icon: 'bar_chart', label: 'Statistiques Chambres' },
    { path: '/admin/logs', icon: 'history', label: 'Journal d\'activité', tooltip: 'Historique des actions' },
    { path: '/admin/settings', icon: 'settings', label: 'Paramètres', tooltip: 'Configuration du système' }
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private profileService: UserProfileService,
    private snackBar: MatSnackBar
  ) {
    this.checkMobile();

    const routeSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.url;
        this.adjustSidenavForMobile();
      });
    this.subscriptions.add(routeSub);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkMobile();
    this.adjustSidenavForMobile();
  }

  ngOnInit(): void {
    this.loadUserData();
    this.loadStats();
    this.setupRoleStats();
    this.loadNotifications();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  checkMobile(): void {
    this.isMobile = window.innerWidth < 768;
  }

  adjustSidenavForMobile(): void {
    if (this.isMobile) {
      this.sidenavOpened = false;
    }
  }

  loadUserData(): void {
    this.user = this.authService.getCurrentUser();
    if (!this.user) this.router.navigate(['/login']);
  }

  loadStats(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe(users => {
      this.stats.totalUsers = users.length;
      this.stats.activeUsers = users.filter(u => u.active).length;
      this.menuItems[1].badge = users.length;
      this.loading = false;
    });
  }

  loadNotifications(): void {
    this.notifications = [
      { id: 1, title: 'Nouvelle réservation', message: 'Chambre 301 réservée', time: '10 min', icon: 'event_available', color: 'primary', read: false, type: 'booking' },
      { id: 2, title: 'Check-in requis', message: 'M. Dupont arrive à 14h00', time: '25 min', icon: 'login', color: 'accent', read: false, type: 'checkin' },
    ];
  }

  setupRoleStats(): void {
    // Exemples simulés
    const rawStats = [
      { role: 'Admin', count: 5, active: 5, inactive: 0 },
      { role: 'MANAGER', count: 12, active: 10, inactive: 2 },
      { role: 'HOUSEKEEPING', count: 20, active: 18, inactive: 2 },
      { role: 'RECEPTIONNISTE', count: 2, active: 2, inactive: 0 },
      { role: 'MAINTENANCE', count: 3, active: 3, inactive: 0 }
    ];

    const total = rawStats.reduce((sum, r) => sum + r.count, 0);
    this.roleStats = rawStats.map(r => ({
      ...r,
      percentage: total ? (r.count / total) * 100 : 0
    }));

    this.roleChartLabels = this.roleStats.map(r => r.role);
    
    this.roleChartData = {
      labels: this.roleChartLabels,
      datasets: [{
        data: this.roleStats.map(r => r.count),
        backgroundColor: this.roleStats.map(r => this.getColorForRole(r.role)),
        hoverOffset: 4
      }]
    };
  }

  getColorForRole(role: string): string {
    const colors: { [key: string]: string } = {
      'Admin': '#3f51b5',
      'MANAGER': '#ff9800',
      'HOUSEKEEPING': '#4caf50',
      'RECEPTIONNISTE': '#e91e63',
      'MAINTENANCE': '#00bcd4'
    };
    return colors[role] || '#9e9e9e';
  }

  toggleSidenav(): void { 
    this.sidenavOpened = !this.sidenavOpened; 
  }
  
  logout(): void { 
    this.authService.logout(); 
    this.router.navigate(['/login']); 
  }
  
  navigateToProfile(): void { 
    this.router.navigate(['/admin/profile']); 
  }
  
  getPageTitle(): string { 
    return 'Tableau de bord'; 
  }
  
  getLastUpdateTime(): string { 
    return new Date().toLocaleTimeString(); 
  }
  
  getGreeting(): string { 
    const h = new Date().getHours(); 
    return h < 12 ? 'Bonjour' : h < 18 ? 'Bon après-midi' : 'Bonsoir'; 
  }
  
  getUnreadNotificationsCount(): number { 
    return this.notifications.filter(n => !n.read).length; 
  }
  
  markNotificationAsRead(notif: Notification) { 
    notif.read = true; 
  }
  
  markAllNotificationsAsRead() { 
    this.notifications.forEach(n => n.read = true); 
  }
}