// src/app/admin/roles/roles.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSnackBarModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSelectModule,
    MatListModule,
    MatChipsModule,
    MatTabsModule
  ],
  templateUrl: './roles.html',
  styleUrls: ['./roles.css']
})
export class RolesComponent implements OnInit {

  roles: any[] = [];
  permissions: any[] = [];

  selectedRole: any = null;
  selectedPermission: any = null;

  newRoleName = '';
  newPermissionName = '';

  loading = false;
  activeTab = 0;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    console.log('🔄 [Roles] Initializing component...');
    this.testLocalStorage();
    this.loadAllData();
  }

  // ================== UTILS ==================
  private getHeaders(): HttpHeaders {
    // تصحيح: استخدم 'token' بدلاً من 'accessToken'
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('❌ [Roles] No token found in localStorage');
      console.log('🔍 Available keys:', Object.keys(localStorage));
    } else {
      console.log('✅ [Roles] Token found:', token.substring(0, 30) + '...');
    }
    
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // دالة جديدة لاختبار localStorage
  testLocalStorage(): void {
    console.log('🧪 [Roles] Testing localStorage:');
    console.log('🔑 Token (key: token):', localStorage.getItem('token') ? '✅ Found' : '❌ Not found');
    console.log('🔑 Token (key: accessToken):', localStorage.getItem('accessToken') ? '✅ Found' : '❌ Not found');
    console.log('👤 User data:', localStorage.getItem('user') ? '✅ Found' : '❌ Not found');
    
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        console.log('📋 User details:', {
          email: user.email,
          roles: user.roles
        });
      } catch (e) {
        console.error('❌ Error parsing user data:', e);
      }
    }
  }

  // ================== LOAD ==================
  loadAllData(): void {
    this.loading = true;
    const headers = this.getHeaders();
    
    console.log('🔄 [Roles] Loading roles from:', 'http://localhost:8070/v1/roles');
    console.log('📋 Headers being sent:', headers.keys());

    // جلب الأدوار
    this.http.get<any[]>('http://localhost:8070/v1/roles', { headers }).subscribe({
      next: (res) => {
        console.log('✅ [Roles] Roles loaded successfully!');
        console.log('📊 Number of roles:', res.length);
        console.log('🎭 Roles:', res);
        
        this.roles = res;
        this.selectedRole = res.length ? res[0] : null;
        this.loading = false;
        
        // اختبار: جلب الأدوار بدون التوكن لمعرفة إذا كانت مشكلة CORS
        this.testWithoutToken();
      },
      error: (error) => {
        console.error('❌ [Roles] Error loading roles:', error);
        console.error('📋 Error details:', {
          status: error.status,
          message: error.message,
          error: error.error
        });
        
        this.loading = false;
        
        // إذا كان الخطأ 401، التوكن غير صالح
        if (error.status === 401) {
          this.snackBar.open('Session expirée. Veuillez vous reconnecter.', 'Fermer', { duration: 5000 });
        }
      }
    });

    // جلب الصلاحيات
    console.log('🔄 [Roles] Loading permissions...');
    this.http.get<any[]>('http://localhost:8070/v1/permissions', { headers }).subscribe({
      next: (res) => {
        console.log('✅ [Roles] Permissions loaded:', res.length);
        this.permissions = res;
      },
      error: (error) => {
        console.error('❌ [Roles] Error loading permissions:', error);
      }
    });
  }

  // اختبار API بدون توكن (للتأكد من CORS)
  testWithoutToken(): void {
    console.log('🔬 [Roles] Testing API without token...');
    
    fetch('http://localhost:8070/v1/roles')
      .then(response => {
        console.log('🌐 No-token response status:', response.status);
        console.log('🌐 No-token response headers:', [...response.headers.entries()]);
      })
      .catch(error => {
        console.error('🌐 No-token fetch error:', error);
      });
  }

  // ================== ROLE ==================
  createRole(): void {
    if (!this.newRoleName.trim()) {
      this.snackBar.open('Veuillez entrer un nom de rôle', 'Fermer', { duration: 3000 });
      return;
    }

    const headers = this.getHeaders();
    const params = new HttpParams().set('name', this.newRoleName.toUpperCase());

    console.log('🔄 [Roles] Creating role:', this.newRoleName);
    
    this.http.post<any>('http://localhost:8070/v1/roles', null, { headers, params }).subscribe({
      next: (role) => {
        console.log('✅ [Roles] Role created:', role);
        this.roles.push(role);
        this.newRoleName = '';
        this.snackBar.open('✅ Rôle créé avec succès', 'Fermer', { duration: 3000 });
      },
      error: (error) => {
        console.error('❌ [Roles] Error creating role:', error);
        this.snackBar.open('❌ Erreur lors de la création du rôle', 'Fermer', { duration: 3000 });
      }
    });
  }

  deleteRole(role: any): void {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le rôle "${role.name}" ?`)) return;

    const headers = this.getHeaders();
    console.log('🔄 [Roles] Deleting role:', role.name);

    this.http.delete(
      `http://localhost:8070/v1/roles/${encodeURIComponent(role.name)}`,
      { headers, responseType: 'text' as 'json' }
    ).subscribe({
      next: () => {
        console.log('✅ [Roles] Role deleted:', role.name);
        this.roles = this.roles.filter(r => r.id !== role.id);
        this.selectedRole = this.roles.length ? this.roles[0] : null;
        this.snackBar.open('✅ Rôle supprimé avec succès', 'Fermer', { duration: 3000 });
      },
      error: (error) => {
        console.error('❌ [Roles] Error deleting role:', error);
        this.snackBar.open('❌ Erreur lors de la suppression', 'Fermer', { duration: 3000 });
      }
    });
  }

  // ================== PERMISSION ==================
  createPermission(): void {
    if (!this.newPermissionName.trim()) {
      this.snackBar.open('Veuillez entrer un nom de permission', 'Fermer', { duration: 3000 });
      return;
    }

    const headers = this.getHeaders();
    const params = new HttpParams().set('name', this.newPermissionName.toUpperCase());

    console.log('🔄 [Roles] Creating permission:', this.newPermissionName);
    
    this.http.post<any>('http://localhost:8070/v1/permissions', null, { headers, params }).subscribe({
      next: (perm) => {
        console.log('✅ [Roles] Permission created:', perm);
        this.permissions.push(perm);
        this.newPermissionName = '';
        this.snackBar.open('✅ Permission créée avec succès', 'Fermer', { duration: 3000 });
      },
      error: (error) => {
        console.error('❌ [Roles] Error creating permission:', error);
        this.snackBar.open('❌ Erreur lors de la création de la permission', 'Fermer', { duration: 3000 });
      }
    });
  }

  deletePermission(permission: any): void {
    if (!confirm(`Supprimer la permission "${permission.name}" ?`)) return;

    const headers = this.getHeaders();
    console.log('🔄 [Roles] Deleting permission:', permission.name);

    this.http.delete(
      `http://localhost:8070/v1/permissions/${permission.id}`,
      { headers, responseType: 'text' as 'json' }
    ).subscribe({
      next: () => {
        console.log('✅ [Roles] Permission deleted:', permission.name);
        this.permissions = this.permissions.filter(p => p.id !== permission.id);
        this.snackBar.open('✅ Permission supprimée avec succès', 'Fermer', { duration: 3000 });
      },
      error: (error) => {
        console.error('❌ [Roles] Error deleting permission:', error);
        this.snackBar.open('❌ Erreur lors de la suppression', 'Fermer', { duration: 3000 });
      }
    });
  }

  // ================== ASSIGN ==================
  assignPermissionToRole(): void {
    if (!this.selectedRole || !this.selectedPermission) {
      this.snackBar.open('Veuillez sélectionner un rôle et une permission', 'Fermer', { duration: 3000 });
      return;
    }

    const headers = this.getHeaders();
    const params = new HttpParams().set('permissionName', this.selectedPermission.name);

    console.log('🔄 [Roles] Assigning permission to role:', {
      role: this.selectedRole.name,
      permission: this.selectedPermission.name
    });

    this.http.post(
      `http://localhost:8070/v1/roles/${encodeURIComponent(this.selectedRole.name)}/permissions`,
      null,
      { headers, params, responseType: 'text' as 'json' }
    ).subscribe({
      next: () => {
        console.log('✅ [Roles] Permission assigned successfully');
        
        if (!this.selectedRole.permissions) {
          this.selectedRole.permissions = [];
        }
        
        this.selectedRole.permissions.push(this.selectedPermission);
        this.selectedPermission = null;
        this.snackBar.open('✅ Permission assignée avec succès', 'Fermer', { duration: 3000 });
      },
      error: (error) => {
        console.error('❌ [Roles] Error assigning permission:', error);
        this.snackBar.open('❌ Erreur lors de l\'assignation', 'Fermer', { duration: 3000 });
      }
    });
  }

  // ================== REMOVE ==================
  removePermissionFromRole(permission: any): void {
    if (!this.selectedRole) return;

    if (!confirm(`Retirer la permission "${permission.name}" du rôle "${this.selectedRole.name}" ?`)) return;

    const headers = this.getHeaders();
    console.log('🔄 [Roles] Removing permission from role:', {
      role: this.selectedRole.name,
      permission: permission.name
    });

    this.http.delete(
      `http://localhost:8070/v1/roles/${encodeURIComponent(this.selectedRole.name)}/permissions/${encodeURIComponent(permission.name)}`,
      { headers, responseType: 'text' as 'json' }
    ).subscribe({
      next: () => {
        console.log('✅ [Roles] Permission removed successfully');
        this.selectedRole.permissions =
          this.selectedRole.permissions.filter((p: any) => p.name !== permission.name);
        this.snackBar.open('✅ Permission retirée avec succès', 'Fermer', { duration: 3000 });
      },
      error: (error) => {
        console.error('❌ [Roles] Error removing permission:', error);
        this.snackBar.open('❌ Erreur lors du retrait', 'Fermer', { duration: 3000 });
      }
    });
  }

  // دالة مساعدة للحصول على الأدوار التي لديها صلاحيات
  getRolesWithPermissions(): any[] {
    return this.roles.filter(role => role.permissions && role.permissions.length > 0);
  }

  // دالة مساعدة للحصول على الأدوار بدون صلاحيات
  getRolesWithoutPermissions(): any[] {
    return this.roles.filter(role => !role.permissions || role.permissions.length === 0);
  }

  // اختبار API مباشر
  testDirectApi(): void {
    console.log('🧪 [Roles] Testing direct API call...');
    
    const token = localStorage.getItem('token');
    
    fetch('http://localhost:8070/v1/roles', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('🔬 Direct fetch response:', {
        status: response.status,
        ok: response.ok,
        headers: [...response.headers.entries()]
      });
      
      if (response.ok) {
        return response.json();
      }
      throw new Error(`HTTP ${response.status}`);
    })
    .then(data => {
      console.log('✅ Direct fetch success:', data.length, 'roles');
    })
    .catch(error => {
      console.error('❌ Direct fetch error:', error);
    });
  }
}