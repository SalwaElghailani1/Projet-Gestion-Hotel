import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
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
import { UserService, CreateUserRequest } from '../../services/user.service'; // <-- CHANGÉ ICI
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatCheckboxModule
  ],
  templateUrl: './add-user.html',
  styleUrls: ['./add-user.css']
})
export class AddUserComponent implements OnInit {
  userForm: FormGroup;
  loading = false;
  submitting = false;
  showPassword = false;
  showConfirmPassword = false;
  
  // Rôles disponibles avec labels
  availableRoles = [
    { value: 'ADMIN', label: 'Administrateur' },
    { value: 'MANAGER', label: 'Manager' },
    { value: 'HOUSEKEEPING', label: 'HOUSEKEEPING' },
    { value: 'RECEPTIONNISTE', label: 'RECEPTIONNISTE' },
    { value: 'MAINTENANCE', label: 'MAINTENANCE' },
    { value: 'COMPTABLE', label: 'COMPTABLE' }
  ];


  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    // Initialisation du formulaire avec toutes les validations
    this.userForm = this.fb.group({
      // Informations personnelles
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      
      // Sécurité
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      
      // Rôle et département
      role: ['', Validators.required],
      department: [''],
      
      // Informations complémentaires
      hireDate: [''],
      notes: [''],
      
      // Statut
      active: [true]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // S'abonner aux changements du rôle pour les champs conditionnels
    this.userForm.get('role')?.valueChanges.subscribe(role => {
      this.updateConditionalFields(role);
    });
  }

  /**
   * Validateur personnalisé pour vérifier la correspondance des mots de passe
   */
  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  /**
   * Met à jour les champs conditionnels selon le rôle
   */
  private updateConditionalFields(role: string): void {
    const departmentControl = this.userForm.get('department');
    const hireDateControl = this.userForm.get('hireDate');
    
    if (role === 'STAFF') {
      departmentControl?.setValidators([Validators.required]);
      hireDateControl?.setValidators([Validators.required]);
    } else {
      departmentControl?.clearValidators();
      hireDateControl?.clearValidators();
    }
    
    departmentControl?.updateValueAndValidity();
    hireDateControl?.updateValueAndValidity();
  }

  /**
   * Vérifie si un champ a une erreur spécifique
   */
  hasError(controlName: string, errorName: string): boolean {
    const control = this.userForm.get(controlName);
    return control ? control.hasError(errorName) && (control.dirty || control.touched) : false;
  }

  /**
   * Bascule la visibilité du mot de passe
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Bascule la visibilité du mot de passe de confirmation
   */
  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  /**
   * Réinitialise complètement le formulaire
   */
  resetForm(): void {
    if (!this.userForm.pristine && confirm('Voulez-vous vraiment réinitialiser le formulaire ? Toutes les données saisies seront perdues.')) {
      this.userForm.reset({
        active: true
      });
      this.showPassword = false;
      this.showConfirmPassword = false;
      this.showInfo('Formulaire réinitialisé');
    }
  }

  /**
   * Soumet le formulaire et crée l'utilisateur
   */
  onSubmit(): void {
    // Marquer tous les champs comme touchés
    this.markFormGroupTouched(this.userForm);
    
    // Vérifier la validité
    if (this.userForm.invalid) {
      this.showError('Veuillez corriger les erreurs dans le formulaire');
      return;
    }
    
    // Récupérer les valeurs du formulaire
    const formValues = this.userForm.value;
    
    // Préparer les données de base (uniquement les champs de l'interface CreateUserRequest)
    const userData: CreateUserRequest = {
      email: formValues.email,
      password: formValues.password,
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      role: [formValues.role] // Convertir en tableau comme attendu
    };
    
    // Mode soumission
    this.submitting = true;
    
    // Créer l'utilisateur
    this.userService.createUser(userData).subscribe({
      next: (response) => {
        this.submitting = false;
        this.showSuccess(`Utilisateur ${formValues.firstName} ${formValues.lastName} créé avec succès !`);
        
        // Redirection après succès
        setTimeout(() => {
          this.router.navigate(['/admin/users']);
        }, 1500);
      },
      error: (error) => {
        this.submitting = false;
        console.error('Erreur création utilisateur:', error);
        
        // Messages d'erreur spécifiques
        if (error.status === 409) {
          this.showError('Cet email est déjà utilisé par un autre utilisateur');
        } else if (error.status === 400) {
          this.showError('Données invalides. Vérifiez les informations saisies');
        } else {
          this.showError('Erreur lors de la création de l\'utilisateur');
        }
      }
    });
  }

  /**
   * Annule et retourne à la liste
   */
  cancel(): void {
    if (this.userForm.dirty) {
      if (confirm('Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter ?')) {
        this.router.navigate(['/admin/users']);
      }
    } else {
      this.router.navigate(['/admin/users']);
    }
  }

  /**
   * Marque tous les contrôles comme touchés pour afficher les erreurs
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  /**
   * Affiche un message de succès
   */
  private showSuccess(message: string): void {
    this.snackBar.open(`✓ ${message}`, 'Fermer', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['success-snackbar']
    });
  }

  /**
   * Affiche un message d'erreur
   */
  private showError(message: string): void {
    this.snackBar.open(`✗ ${message}`, 'Fermer', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar']
    });
  }

  /**
   * Affiche un message d'information
   */
  private showInfo(message: string): void {
    this.snackBar.open(`ℹ ${message}`, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['info-snackbar']
    });
  }

  /**
   * Récupère le label d'un rôle
   */
  getRoleLabel(roleValue: string): string {
    const role = this.availableRoles.find(r => r.value === roleValue);
    return role ? role.label : roleValue;
  }

  /**
   * Formate une date pour l'affichage
   */
  formatDate(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR');
  }
}