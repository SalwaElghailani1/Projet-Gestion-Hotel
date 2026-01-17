import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import {Router} from '@angular/router';
import { ReservationService } from '../../../services/reservation.service';

interface Reservation {
  idReservation: number;
  statut: string;
  dateDebut: string;
  chambre?: { numero?: string };
  chambre_id?: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './profil-client.html',
  styleUrls: ['./profil-client.css']
})


export class ProfileComponent implements OnInit {
  activeSection = 'profile';
  unreadNotifications = 3;
  showModal = false;
  modalMessage = '';
  pendingAction: string = '';
  isLoading = false; // <-- AJOUTÉ


  imagePreview: string | null = null;
  selectedImageFile: File | null = null;

  user: any = {};

  profileForm!: FormGroup;



  // Settings
  settings = {
    emailNotifications: true,
    smsNotifications: false,
    language: 'fr',
    publicProfile: true
  };

  // Contact
  contactMessage = '';

  // Report
  report = {
    type: 'technical',
    subject: '',
    description: '',
    screenshot: null as File | null
  };


  originalFormData: any;

  reservationMessage: string | null = null;
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private reservationService: ReservationService,) {
    const nav = this.router.getCurrentNavigation();
    this.reservationMessage =
      nav?.extras?.state?.['reservationMessage'] || null;
  }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      tel: ['', Validators.required],
      dateNaissance: ['', Validators.required],
      cni: ['', Validators.required]
    });

    this.loadClientProfile();
    this.loadClientReservations();
  }

  loadClientProfile() {
    this.isLoading = true;

    this.authService.getClientProfile().subscribe({
      next: (client: any) => {
        this.user = client;

        this.profileForm.patchValue({
          nom: client.nom,
          prenom: client.prenom,
          email: client.email,
          tel: client.tel,
          dateNaissance: client.dateNaissance,
          cni: client.cni
        });

        this.imagePreview = null;

        if (client.photo_carte_identity && client.photo_carte_identity !== '') {
          this.imagePreview = client.photo_carte_identity;
        }
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  updateProfile() {
    if (this.profileForm.invalid) return;

    const payload = {
      nom: this.profileForm.value.nom,
      prenom: this.profileForm.value.prenom,
      tel: this.profileForm.value.tel,
      dateNaissance: this.profileForm.value.dateNaissance,
      cni: this.profileForm.value.cni,
      photo_carte_identity: this.imagePreview // base64
    };

    this.isLoading = true;

    this.authService.updateClientProfile(payload).subscribe({
      next: () => {
        alert('✅ Profil mis à jour avec succès');
        this.isLoading = false;
      },
      error: () => {
        alert('❌ Erreur lors de la mise à jour');
        this.isLoading = false;
      }
    });
  }


  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.selectedImageFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  loadUserData(): void {
    // Simuler le chargement des données
    this.profileForm.patchValue(this.user);
    this.originalFormData = this.profileForm.value;
  }

  showSection(section: string): void {
    this.activeSection = section;
  }



  onScreenshotSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.report.screenshot = file;
    }
  }

  cancelEdit(): void {
    this.profileForm.patchValue(this.originalFormData);

    this.imagePreview = this.user.photo_carte_identity
      ? this.user.photo_carte_identity
      : null;
  }


  toggleRead(notification: any): void {
    notification.read = !notification.read;
    this.calculateUnreadNotifications();
  }

  markAllAsRead(): void {
    this.notifications.forEach(notif => notif.read = true);
    this.unreadNotifications = 0;
  }

  calculateUnreadNotifications(): void {
    this.unreadNotifications = this.notifications.filter(n => !n.read).length;
  }

  sendMessage(): void {
    if (this.contactMessage.trim()) {
      console.log('Message envoyé:', this.contactMessage);
      this.contactMessage = '';
      this.showNotification('Message envoyé avec succès!');
    }
  }

  submitReport(): void {
    if (this.report.subject && this.report.description) {
      console.log('Rapport soumis:', this.report);
      this.report = {
        type: 'technical',
        subject: '',
        description: '',
        screenshot: null
      };
      this.showNotification('Problème signalé avec succès!');
    }
  }

  logout(): void {
    this.modalMessage = 'Êtes-vous sûr de vouloir vous déconnecter?';
    this.pendingAction = 'logout';
    this.showModal = true;
  }

  deleteAccount(): void {
    this.modalMessage = 'Êtes-vous sûr de vouloir supprimer votre compte? Cette action est irréversible!';
    this.pendingAction = 'deleteAccount';
    this.showModal = true;
  }

  confirmAction(): void {
    this.showModal = false;

    if (this.pendingAction === 'logout') {
      // Logique de déconnexion
      console.log('Déconnexion...');
      this.showNotification('Déconnexion réussie!');
    } else if (this.pendingAction === 'deleteAccount') {
      // Logique de suppression de compte
      console.log('Compte supprimé...');
      this.showNotification('Compte supprimé avec succès!');
    }

    this.pendingAction = '';
  }

  showNotification(message: string): void {
    alert(message);
  }

  getMemberSince(createdAt: string): string {
    const createdDate = new Date(createdAt);
    const now = new Date();

    const diffMs = now.getTime() - createdDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "aujourd’hui";
    if (diffDays === 1) return "il y a 1 jour";
    if (diffDays < 30) return `il y a ${diffDays} jours`;
    if (diffDays < 365) return `il y a ${Math.floor(diffDays / 30)} mois`;

    const years = Math.floor(diffDays / 365);
    return `il y a ${years} an${years > 1 ? 's' : ''}`;
  }


  clientReservations: any[] = [];
  notifications: any[] = [];

  loadClientReservations() {
    this.reservationService.getClientReservations().subscribe({
      next: (res: any) => {
        this.clientReservations = res.reservations || [];

        this.clientReservations.forEach(r => {
          const exists = this.notifications.find(n => n.id === r.idReservation);
          if (!exists) {
            this.notifications.unshift({
              id: r.idReservation,
              title: `Reservation Room ${r.chambre?.numero || r.chambre_id}`,
              message: `Your Resevertion is : ${r.statut}`,
              time: new Date(r.dateDebut).toLocaleDateString('fr-FR'),
              read: r.statut !== 'pending',
              icon: 'fas fa-bed'
            });
          }
        });
      },
      error: (err) => console.error(err)
    });
  }

  goToPayment() {
    this.router.navigate(['/profil/payment']);
  }

}
