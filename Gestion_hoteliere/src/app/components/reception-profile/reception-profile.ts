import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {RoomService} from '../../services/room.service';
import {UserProfileService} from '../../services/user-profile.service';
import {AuthService} from '../../services/auth.service';
import {ReservationService} from '../../services/reservation.service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Chart, registerables } from 'chart.js';


@Component({
  selector: 'app-reception-profile',
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    HttpClientModule,
    NgClass,
    DatePipe,      // <-- ajouté
    DecimalPipe    // <-- ajouté
  ],
  templateUrl: './reception-profile.html',
  styleUrl: './reception-profile.css',
})
export class ReceptionProfile implements OnInit{
  rooms: any[] = [];
  user: any = {};
  createRoomModalOpen = false;

  activeSection = 'profile';
  showModal = false;
  modalMessage = '';
  pendingAction: string | null = null;
  reportForm: FormGroup;

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

  profileForm: FormGroup;
  imagePreview: string | null = null;
  originalFormData: any;
  imageFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private roomService: RoomService,
    private userProfileService: UserProfileService,
    private authService: AuthService,
    private reservationService: ReservationService
  ) {
    this.profileForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      telephone: ['', Validators.required],
      dateNaissance: ['', Validators.required],
      cin: ['', Validators.required],
      adresse: ['', Validators.required],
    });

    this.reportForm = this.fb.group({
      reportFile: [null, Validators.required]
    });
  }

  ngOnInit() {
    Chart.register(...registerables);
    this.testMeEndpoint();
    this.loadMyProfile();
    this.loadRooms();
    this.loadReservations();
  }

  loadRooms() {
    this.roomService.getRooms().subscribe({
      next: (data) => {
        this.rooms = data;
        this.initStatusChart();
        this.initPriceChart();
      },
      error: (err) => console.error('Error fetching rooms', err)
    });
  }

  loadMyProfile() {
    console.log('CALLING /me ...');

    this.userProfileService.getMyProfile().subscribe({
      next: profile => {
        console.log('PROFILE OK', profile);

        this.profileForm.patchValue({
          nom: profile.nom,
          prenom: profile.prenom,
          email: profile.email,
          telephone: profile.telephone,
          cin: profile.cin,
          adresse: profile.adresse,
          dateNaissance: profile.dateNaissance
        });

        console.log('EMAIL IN FORM', this.profileForm.get('email')?.value);

        this.user = profile;
      },
      error: err => {
        console.error('ERROR PROFILE', err);
      }
    });
  }
  testMeEndpoint() {
    this.userProfileService.getMyProfile().subscribe({
      next: res => console.log('ME OK', res),
      error: err => console.error('ME ERROR', err)
    });
  }


  updateProfile(): void {
    if (this.profileForm.valid) {
      // On ne prend que les champs modifiables
      const updateData = {
        nom: this.profileForm.value.nom,
        prenom: this.profileForm.value.prenom,
        email: this.profileForm.value.email,
        telephone: this.profileForm.value.telephone,
        dateNaissance: this.profileForm.value.dateNaissance,
        cin: this.profileForm.value.cin,
        adresse: this.profileForm.value.adresse
      };


      this.userProfileService.updateMyProfile(updateData).subscribe({
        next: updatedProfile => {
          // Mettre à jour l'UI
          this.user = {...this.user, ...updateData};
          this.originalFormData = this.profileForm.value;

          this.showNotification('Profil mis à jour avec succès!');
        },
        error: err => {
          console.error('Erreur lors de la mise à jour du profil', err);
          this.showNotification('Erreur lors de la mise à jour du profil');
        }
      });
    }
  }
  closeCreateRoomModal() {
    this.createRoomModalOpen = false;
  }
  showSection(section: string): void {
    this.activeSection = section;

    if(section === 'rooms' && this.rooms.length) {
      setTimeout(() => {
        this.initStatusChart();
        this.initPriceChart();
      }, 0);
    }

    if(section === 'reservations' && this.reservations.length) {
      setTimeout(() => {
        this.initReservationCharts();
      }, 0);
    }
  }




  onScreenshotSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.report.screenshot = file;
    }
  }

  cancelEdit(): void {
    this.profileForm.patchValue(this.originalFormData);
    this.imagePreview = null;
  }



  //-----------------------------------------------------------------------------------------------------------
  sendMessage(): void {
    if (this.contactMessage.trim()) {
      console.log('Message envoyé:', this.contactMessage);
      this.contactMessage = '';
      this.showNotification('Message envoyé avec succès!');
    }
  }


  logout(): void {
    this.modalMessage = 'Êtes-vous sûr de vouloir vous déconnecter?';
    this.pendingAction = 'logout';
    this.showModal = true;
  }

  //-----------------------------------------------------------------------------------------------------
  deleteAccount(): void {
    this.modalMessage = 'Êtes-vous sûr de vouloir supprimer votre compte? Cette action est irréversible!';
    this.pendingAction = 'deleteAccount';
    this.showModal = true;
  }

  confirmAction(): void {
    if (this.pendingAction === 'logout') {
      this.userProfileService.logout();
    }
    this.showModal = false;
    this.pendingAction = null;
  }


  showNotification(message: string): void {
    // Simuler une notification
    alert(message);

    // Dans une application réelle, vous utiliseriez un service de notifications
    // this.notificationService.show(message);
  }

  clientsOpen = false;

  toggleClients() {
    this.clientsOpen = !this.clientsOpen;
  }

  roomsOpen = false;

  toggleRooms() {
    this.roomsOpen = !this.roomsOpen;
  }


  reservations: any[] = [];

  loadReservations() {
    this.reservationService.getAllReservations().subscribe({
      next: (data: any) => {
        this.reservations = data.reservations || [];

        // Si la section est active, afficher les charts
        if(this.activeSection === 'reservations') {
          setTimeout(() => this.initReservationCharts(), 0);
        }
      },
      error: (err) => console.error('Erreur fetching reservations', err)
    });
  }


  confirmReservation(res: any) {
    this.reservationService.updateStatus(res.idReservation, 'confirmed')
      .subscribe({
        next: () => {
          res.statut = 'confirmed';

          this.roomService.toggleRoomState(res.chambre_id, 'Occupée')
            .subscribe({
              next: () => {
                alert('🚫 La chambre est maintenant OCCUPÉE');
              },
              error: err => {
                console.error(err);
                alert('❌ Erreur lors du changement de l’état de la chambre');
              }
            });
        },
        error: err => {
          console.error(err);
          alert('❌ Erreur lors de la confirmation');
        }
      });
  }


  rejectReservation(res: any) {
    this.reservationService.updateStatus(res.idReservation, 'rejected')
      .subscribe({
        next: () => {
          res.statut = 'rejected';

          this.roomService.toggleRoomState(res.chambre_id, 'Disponible')
            .subscribe({
              next: () => {
                alert('✅ La chambre est maintenant LIBRE');
              },
              error: err => {
                console.error(err);
                alert('❌ Erreur lors du changement de l’état de la chambre');
              }
            });
        },
        error: err => {
          console.error(err);
          alert('❌ Erreur lors du rejet');
        }
      });
  }


// ------------------- Status Chart -------------------
  initStatusChart() {
    const statusCount: Record<string, number> = {
      'Disponible': 0,
      'Occupée': 0,
      'Maintenance': 0
    };

    this.rooms.forEach(room => {
      if (statusCount[room.etat] !== undefined) {
        statusCount[room.etat]++;
      }
    });

    new Chart('statusChart', {
      type: 'doughnut',
      data: {
        labels: ['Disponible', 'Occupée', 'Maintenance'],
        datasets: [{
          data: [
            statusCount['Disponible'],
            statusCount['Occupée'],
            statusCount['Maintenance']
          ],
          backgroundColor: ['#2e7d32', '#c62828', '#f57c00'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }


// ------------------- Price Chart -------------------
  initPriceChart() {
    const pricesByType: Record<string, number[]> = {};

    // Group prices by room type
    this.rooms.forEach(room => {
      if (!pricesByType[room.type]) {
        pricesByType[room.type] = [];
      }
      pricesByType[room.type].push(room.prix);
    });

    const labels = Object.keys(pricesByType);
    const avgPrices = labels.map(type => {
      const prices = pricesByType[type];
      return prices.reduce((a, b) => a + b, 0) / prices.length;
    });

    new Chart('priceChart', {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Average Price (MAD)',
          data: avgPrices,
          backgroundColor: '#b89a5e'
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }


  initReservationCharts() {
    if (!this.reservations || this.reservations.length === 0) return;

    // 1️⃣ Reservations count by room type
    const typeCount: Record<string, number> = {};
    this.reservations.forEach(res => {
      const type = res.chambre?.type || res.typeChambre || 'Unknown';
      typeCount[type] = (typeCount[type] || 0) + 1;
    });

    const typeLabels = Object.keys(typeCount);
    const typeData = typeLabels.map(type => typeCount[type]);
    const totalReservations = typeData.reduce((a, b) => a + b, 0);
    const typePercentages = typeData.map(count => (count / totalReservations * 100).toFixed(1));

    new Chart('reservationTypeChart', {
      type: 'doughnut',
      data: {
        labels: typeLabels.map((t, i) => `${t} (${typePercentages[i]}%)`),
        datasets: [{
          data: typeData,
          backgroundColor: ['#4caf50', '#ff9800', '#2196f3', '#f44336', '#9c27b0'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } }
      }
    });

    // 2️⃣ Average price by room type
    const pricesByType: Record<string, number[]> = {};
    this.reservations.forEach(res => {
      const type = res.chambre?.type || res.typeChambre || 'Unknown';
      if (!pricesByType[type]) pricesByType[type] = [];
      pricesByType[type].push(res.totalPrix);
    });

    const priceLabels = Object.keys(pricesByType);
    const avgPrices = priceLabels.map(type => {
      const prices = pricesByType[type];
      return prices.reduce((a, b) => a + b, 0) / prices.length;
    });

    new Chart('reservationPriceChart', {
      type: 'bar',
      data: {
        labels: priceLabels,
        datasets: [{
          label: 'Average Price (MAD)',
          data: avgPrices,
          backgroundColor: '#b89a5e'
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
}
