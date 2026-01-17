// src/app/admin/edit-user/edit-user.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UserService, UserResponseDTO } from '../../services/user.service'; // Retirer UpdateUserDTO
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    HttpClientModule, 
    MatProgressSpinnerModule,
    MatDividerModule,
    MatCheckboxModule
  ],
  templateUrl: './edit-user.html',
  styleUrls: ['./edit-user.css']
})
export class EditUserComponent implements OnInit {
  userForm: FormGroup;
  loading = false;
  submitting = false;
  userId: number | null = null;
  user: UserResponseDTO | null = null;

  // Rôles disponibles
  availableRoles = [
    { value: 'ADMIN', label: 'Administrateur' },
    { value: 'MANAGER', label: 'Manager' },
    { value: 'STAFF', label: 'Personnel' },
    { value: 'CLIENT', label: 'Client' }
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Initialisation du formulaire
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      roles: [[], Validators.required],
      active: [true]
    });
  }

  ngOnInit(): void {
    // Récupérer l'ID depuis l'URL
    this.route.params.subscribe(params => {
      this.userId = Number(params['id']);
      
      if (this.userId && !isNaN(this.userId)) {
        this.loadUser();
      } else {
        this.showError('ID utilisateur non valide');
        this.router.navigate(['/admin/users']);
      }
    });
  }

  loadUser(): void {
    this.loading = true;
    
    // Utiliser getUserById si disponible
    this.userService.getUserById(this.userId!).subscribe({
      next: (user) => {
        this.user = user;
        this.patchFormValues();
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Erreur:', error);
        this.loading = false;
        this.showError('Utilisateur non trouvé');
        this.router.navigate(['/admin/users']);
      }
    });
  }

  private patchFormValues(): void {
    if (!this.user) return;

    // S'assurer que roles est toujours un tableau
    const userRoles = Array.isArray(this.user.roles) ? this.user.roles : [this.user.roles];
    
    this.userForm.patchValue({
      firstName: this.user.firstName || '',
      lastName: this.user.lastName || '',
      email: this.user.email || '',
      roles: userRoles,
      active: this.user.active !== undefined ? this.user.active : true
    });
  }

  // Vérifie si un champ a une erreur
  hasError(controlName: string, errorName: string): boolean {
    const control = this.userForm.get(controlName);
    return control ? control.hasError(errorName) && (control.dirty || control.touched) : false;
  }

  // Soumission du formulaire
  onSubmit(): void {
  // Marquer tous les champs comme touchés
  this.markFormGroupTouched(this.userForm);
  
  // Vérifier la validité
  if (this.userForm.invalid || !this.userId) {
    this.showError('Veuillez corriger les erreurs dans le formulaire');
    return;
  }

  this.submitting = true;
  
  // Créer l'objet de mise à jour
  const updateData = {
    firstName: this.userForm.value.firstName.trim(),
    lastName: this.userForm.value.lastName.trim(),
    email: this.userForm.value.email.trim(),
    roles: this.userForm.value.roles,
    active: this.userForm.value.active
  };

  console.log('=== DEBUG UPDATE ===');
  console.log('ID utilisateur:', this.userId);
  console.log('Données à envoyer:', updateData);
  console.log('URL API:', `${this.userService['apiUrl']}/users/${this.userId}`);
  console.log('Token:', localStorage.getItem('accessToken'));
  console.log('===================');

  this.userService.updateUser(this.userId, updateData).subscribe({
    next: (response) => {
      console.log('Réponse API:', response);
      this.submitting = false;
      this.showSuccess('Utilisateur mis à jour avec succès');
      
      // Redirection après succès
      setTimeout(() => {
        this.router.navigate(['/admin/users']);
      }, 1500);
    },
    error: (error: any) => {
      this.submitting = false;
      console.error('Erreur de mise à jour complète:', error);
      console.error('Statut:', error.status);
      console.error('Message:', error.message);
      console.error('Détails:', error.error);
      
      // Gérer les erreurs spécifiques
      let errorMessage = 'Erreur lors de la mise à jour';
      
      if (error.status === 409) {
        errorMessage = 'Cet email est déjà utilisé par un autre utilisateur';
      } else if (error.status === 400) {
        errorMessage = 'Données invalides';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
      } else if (error.status === 404) {
        errorMessage = 'Utilisateur non trouvé';
      } else if (error.status === 403) {
        errorMessage = 'Vous n\'avez pas les permissions nécessaires';
      } else if (error.status === 401) {
        errorMessage = 'Session expirée. Veuillez vous reconnecter.';
        localStorage.removeItem('accessToken');
        setTimeout(() => this.router.navigate(['/login']), 2000);
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      this.showError(errorMessage);
    }
  });
}

  // Annulation
  cancel(): void {
    if (this.userForm.dirty) {
      if (confirm('Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter ?')) {
        this.router.navigate(['/admin/users']);
      }
    } else {
      this.router.navigate(['/admin/users']);
    }
  }

  // Marque tous les contrôles comme touchés
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Messages de succès
  private showSuccess(message: string): void {
    this.snackBar.open(`✓ ${message}`, 'Fermer', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['success-snackbar']
    });
  }

  // Messages d'erreur
  private showError(message: string): void {
    this.snackBar.open(`✗ ${message}`, 'Fermer', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar']
    });
  }

  // Méthode pour obtenir le label d'un rôle
  getRoleLabel(roleValue: string): string {
    const role = this.availableRoles.find(r => r.value === roleValue);
    return role ? role.label : roleValue;
  }
}