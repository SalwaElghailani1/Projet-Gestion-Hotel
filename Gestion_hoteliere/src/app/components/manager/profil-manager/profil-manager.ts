import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {RoomService} from '../../../services/room.service';
import {UserProfileService} from '../../../services/user-profile.service';
import {UserResponseDTO, UserService} from '../../../services/user.service';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-profil-manager',
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,

    HttpClientModule,
    NgClass
  ],
  templateUrl: './profil-manager.html',
  styleUrl: './profil-manager.css',
})
export class ProfilManager implements OnInit{
  rooms: any[] = [];
  user: any = {};
  selectedRoom: any = null;
  createRoomModalOpen = false;
  isEditMode = false;

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
  ) {
    this.profileForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      tel: ['', Validators.required],
      dateNaissance: ['', Validators.required],
      cne: ['', Validators.required],
      image: ['']
    });

    this.reportForm = this.fb.group({
      reportFile: [null, Validators.required]  // ajout Validators ila bghiti
    });
  }

  ngOnInit() {
    this.testMeEndpoint();
    this.loadMyProfile();
    this.loadRooms();
    this.fetchUsers();
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
          tel: profile.tel,
          cne: profile.cne,
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
        tel: this.profileForm.value.tel,
        dateNaissance: this.profileForm.value.dateNaissance,
        cne: this.profileForm.value.cne
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

  loadRooms() {
    this.roomService.getRooms().subscribe(data => {
      this.rooms = data;
    });
  }

  openCreateRoomModal() {
    this.isEditMode = false;
    this.selectedRoom = {};
    this.imageFile = null;
    this.createRoomModalOpen = true;
  }

  editRoom(room: any) {
    this.isEditMode = true;
    this.selectedRoom = { ...room };
    this.imageFile = null; // reset file
    this.createRoomModalOpen = true;
  }

  closeCreateRoomModal() {
    this.createRoomModalOpen = false;
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.roomService.uploadImage(file).subscribe({
      next: (imageUrl: string) => {
        this.selectedRoom.image = imageUrl.replace('/uploads/', ''); // نخلي غير filename
        this.imagePreview = imageUrl;

        if (this.selectedRoom.id) {
          const index = this.rooms.findIndex(r => r.id === this.selectedRoom.id);
          if (index > -1) {
            this.rooms[index].image = this.selectedRoom.image;
          }
        }
      },
      error: err => console.error(err)
    });
  }


  // Méthode pour calculer % par statut
  getRoomStatusPercentage(status: string): number {
    if (!this.rooms || this.rooms.length === 0) return 0;
    const count = this.rooms.filter(r => r.etat === status).length;
    return Math.round((count / this.rooms.length) * 100);
  }


  submitRoom() {
    if (!this.selectedRoom) return;

    // Build the DTO to match backend
    const roomDto = {
      numero: this.selectedRoom.numero,
      type: this.selectedRoom.type,
      prix: Number(this.selectedRoom.prix),
      etat: this.selectedRoom.etat,
      description: this.selectedRoom.description || '',
      taux: Number(this.selectedRoom.taux) || 0,
      image: this.selectedRoom.image || '',
      lit_long: Number(this.selectedRoom.lit_long) || 0,
      lit_large: Number(this.selectedRoom.lit_large) || 0
    };

    if (this.isEditMode) {
      this.roomService.updateRoom(this.selectedRoom.id, roomDto).subscribe({
        next: () => {
          this.loadRooms();
          this.closeCreateRoomModal();
          alert('Chambre modifiée avec succès!');
        },
        error: (err) => {
          console.error('Erreur update room', err);
          alert('Erreur lors de la modification de la chambre.');
        }
      });
    } else {
      this.roomService.createRoom(roomDto).subscribe({
        next: () => {
          this.loadRooms();
          this.closeCreateRoomModal();
          alert('Chambre créée avec succès!');
        },
        error: (err) => {
          console.error('Erreur create room', err);
          alert('Erreur lors de la création de la chambre.');
        }
      });
    }
  }


  deleteRoom(id: number) {
    if (confirm('Voulez-vous supprimer cette chambre ?')) {
      this.roomService.deleteRoom(id).subscribe(() => {
        this.loadRooms();
        alert('Chambre supprimée avec succès!');
      });
    }
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
    this.modalMessage = 'Êtes-vous sûr de vouloir vous déconnecter ?';
    this.pendingAction = 'logout';
    this.showModal = true;
  }

  confirmAction(): void {
    if (this.pendingAction === 'logout') {
      this.userProfileService.logout();
    }
    this.showModal = false;
    this.pendingAction = null;
  }


  //-----------------------------------------------------------------------------------------------------
  deleteAccount(): void {
    this.modalMessage = 'Êtes-vous sûr de vouloir supprimer votre compte? Cette action est irréversible!';
    this.pendingAction = 'deleteAccount';
    this.showModal = true;
  }


  showNotification(message: string): void {
    // Simuler une notification
    alert(message);

    // Dans une application réelle, vous utiliseriez un service de notifications
    // this.notificationService.show(message);
  }

  internalUsers: any[] = [];
  fetchUsers() {
    this.userProfileService.getAllProfiles().subscribe({
      next: users => {
        this.internalUsers = users;
        console.log('USERS FETCHED:', this.internalUsers);
      },
      error: err => {
        console.error('Erreur lors du chargement des utilisateurs', err);
      }
    });
  }

}
