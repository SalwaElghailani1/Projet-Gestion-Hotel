import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon'; // AJOUTER

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatButtonModule, 
    MatCardModule,
    MatIconModule // AJOUTER
  ],
  template: `
    <div class="unauthorized-container">
      <mat-card class="unauthorized-card">
        <mat-card-header>
          <mat-card-title>Accès non autorisé</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="content">
            <mat-icon class="icon">block</mat-icon>
            <h2>403 - Accès refusé</h2>
            <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
            <p>Veuillez contacter un administrateur si vous pensez que c'est une erreur.</p>
          </div>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" routerLink="/login">
            <mat-icon>login</mat-icon>
            Retour à la connexion
          </button>
          <button mat-button routerLink="/">
            <mat-icon>home</mat-icon>
            Accueil
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #f5f5f5;
    }
    
    .unauthorized-card {
      max-width: 500px;
      text-align: center;
      padding: 30px;
    }
    
    .content {
      padding: 20px 0;
    }
    
    .icon {
      font-size: 80px;
      height: 80px;
      width: 80px;
      color: #f44336;
      margin-bottom: 20px;
    }
    
    h2 {
      color: #333;
      margin-bottom: 15px;
    }
    
    p {
      color: #666;
      margin-bottom: 10px;
    }
    
    mat-card-actions {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin-top: 20px;
    }
  `]
})
export class UnauthorizedComponent {}