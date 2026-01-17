// src/app/admin/user-list/user-list.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService, UserResponseDTO } from '../../services/user.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatSnackBarModule,
    HttpClientModule
  ],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.css']
})
export class UserListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'email', 'name', 'roles', 'status', 'actions'];
  users: UserResponseDTO[] = [];
  loading = false;
  statusUpdatingIds: number[] = []; // Pour suivre quels utilisateurs sont en cours de mise à jour

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // ===================== LOAD USERS =====================
  loadUsers(): void {
    this.loading = true;
    console.log('📋 [UserList] Loading users...');
    
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        console.log('✅ [UserList] Users loaded:', users.length);
        this.users = users;
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ [UserList] Error loading users:', error);
        this.loading = false;
        this.showError('Erreur lors du chargement des utilisateurs');
      }
    });
  }

  // ===================== DELETE USER =====================
  deleteUser(user: UserResponseDTO): void {
    const ok = window.confirm(
      `Êtes-vous sûr de vouloir supprimer ${user.firstName} ${user.lastName} ?`
    );
    if (!ok) return;

    this.loading = true;

    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== user.id);
        this.loading = false;
        this.showSuccess('Utilisateur supprimé avec succès');
      },
      error: (error) => {
        console.error('❌ [UserList] Delete error:', error);
        this.loading = false;
        this.showError('Erreur lors de la suppression');
      }
    });
  }

  // ===================== ACTIVER / DESACTIVER =====================
  toggleUserStatus(user: UserResponseDTO): void {
    const newStatus = !user.active;
    const action = newStatus ? 'activer' : 'désactiver';
    const actionPast = newStatus ? 'activé' : 'désactivé';

    console.log(`🔄 [UserList] Toggling user ${user.id} (${user.email}) from ${user.active} to ${newStatus}`);

    const ok = window.confirm(
      `Êtes-vous sûr de vouloir ${action} ${user.firstName} ${user.lastName} ?`
    );
    if (!ok) return;

    // Ajouter l'ID à la liste des mises à jour en cours
    this.statusUpdatingIds.push(user.id);

    this.userService.toggleUserStatus(user.id, newStatus).subscribe({
     next: (updatedUser) => {
  console.log('✅ Utilisateur mis à jour :', updatedUser);
  
  // 🔥 On recharge la liste des utilisateurs pour que le changement apparaisse immédiatement
  this.loadUsers();  // cette étape est nécessaire
  
  this.statusUpdatingIds = this.statusUpdatingIds.filter(id => id !== user.id);
  this.showSuccess(`L'utilisateur a été ${actionPast} avec succès`);
},

      error: (error) => {
        console.error(`❌ [UserList] Error ${action} user:`, error);
        
        // Retirer l'ID de la liste des mises à jour
        this.statusUpdatingIds = this.statusUpdatingIds.filter(id => id !== user.id);
        
        this.showError(`Erreur lors de la ${action}: ${error.message || 'Vérifiez la console'}`);
      }
    });
  }

  // Vérifie si un utilisateur est en cours de mise à jour
  isStatusUpdating(userId: number): boolean {
    return this.statusUpdatingIds.includes(userId);
  }

  // ===================== ROLES =====================
  getRoleDisplayName(role: string): string {
    const roleMap: { [key: string]: string } = {
      ADMIN: 'Admin',
      MANAGER: 'Manager',
      HOUSEKEEPING: 'Housekeeping',
      RECEPTIONNISTE: 'Réceptionniste',
      MAINTENANCE: 'Maintenance',
      COMPTABLE: 'Comptable',
    };
    return roleMap[role] || role;
  }

  getRoleClass(role: string): string {
    const classMap: { [key: string]: string } = {
      ADMIN: 'role-admin',
      MANAGER: 'role-manager',
      HOUSEKEEPING: 'role-housekeeping',
      RECEPTIONNISTE: 'role-receptionniste',
      MAINTENANCE: 'role-maintenance',
      COMPTABLE: 'role-comptable',
    };
    return classMap[role] || 'role-default';
  }

  // ===================== SNACKBAR =====================
  showSuccess(message: string): void {
    this.snackBar.open(`✓ ${message}`, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['success-snackbar']
    });
  }

  showError(message: string): void {
    this.snackBar.open(`✗ ${message}`, 'Fermer', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar']
    });
  }
}