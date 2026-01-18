import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';

import { RoomService } from '../services/room.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ReservationService } from '../services/reservation.service';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-room-details',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIf, FormsModule],
  templateUrl: './room-details.html',
  styleUrls: ['./room-details.css'],
})
export class RoomDetails {

  room: any;
  loading = true;
  errorMsg = '';

  navItems = [
    { name: 'Home',  route: '/', active: false },
    { name: 'About', route: '/about', active: false },
    { name: 'Contact', route: '/contact', active: false },
    { name: 'Profile', route: '/room/:id/profil', active: false }
  ];

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    private authService: AuthService,
    private reservationService: ReservationService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.route.paramMap.subscribe(params => {
      const roomId = Number(params.get('id'));

      if (!roomId) {
        this.errorMsg = 'Room ID not found';
        this.loading = false;
        return;
      }

      this.loadRoom(roomId);
    });
  }


  loadRoom(roomId: number) {
    this.loading = true;

    this.roomService.getRoomById(roomId).subscribe({
      next: (data) => {
        this.room = data;
        this.loading = false;

        this.loadSimilarRooms(this.room.type, this.room.id);

        this.reservation.roomNumber = this.room.numero;
        this.reservation.roomType = this.room.type;
      },
      error: () => {
        this.errorMsg = 'Failed to load room';
        this.loading = false;
      }
    });
  }


  showModal = false; // <-- Angular variable to control modal

  // Form model
  reservation = {
    fname: '',
    lname: '',
    email: '',
    tel: '',
    roomNumber: '',
    roomType: '',
    startDate: '',
    endDate: '',
    dob: '',
    cni: ''
  };

  openModal() {
    this.showModal = true;

    this.authService.getClientProfile().subscribe({
      next: (client: any) => {
        this.reservation.fname = client.nom || '';
        this.reservation.lname = client.prenom || '';
        this.reservation.email = client.email || '';
        this.reservation.tel = client.tel || '';
        this.reservation.cni = client.cni || '';
        this.reservation.dob = client.dateNaissance || '';
      },
      error: (err) => {
        console.error('Error loading client profile', err);
      }
    });
  }


  closeModal() {
    this.showModal = false;
  }

  submitReservation(event?: Event) {
    if(event) event.preventDefault(); // <--- prevent page reload

    const clientUpdate = {
      tel: this.reservation.tel,
      cni: this.reservation.cni,
      dateNaissance: this.reservation.dob
    };

    this.authService.updateClientProfile(clientUpdate).subscribe({
      next: () => {
        const start = new Date(this.reservation.startDate);
        const end = new Date(this.reservation.endDate);
        const nuits = (end.getTime() - start.getTime()) / (1000*60*60*24);
        const totalPrix = parseFloat((nuits * this.room.prix).toFixed(2));

        const reservationPayload = {
          client_id: this.authService.getUserId(),
          chambre_id: this.room.id,
          dateDebut: this.reservation.startDate,
          dateFin: this.reservation.endDate,
          nombrePersonnes: 1,
          typeChambre: this.room.type,
          photoActeMariage: "",
          totalPrix: totalPrix,
          statut: "pending"
        };

        this.reservationService.createReservation(reservationPayload).subscribe({
          next: (res) => {
            this.closeModal();
            setTimeout(() => {
              this.router.navigate(
                ['/room', this.room.id, 'profil'],
                {
                  state: {
                    reservationMessage: 'You will receive a confirmation or a rejection.\n' +
                      'Please check the Notifications section to stay informed about the status of your reservation.'
                  }
                }
              );

            }, 2000);

          }
        });
      },
      error: (err) => {
        console.error('Client update error', err);
        alert('Error updating client profile');
      }
    });
  }

  similarRooms: any[] = [];
  loadSimilarRooms(type: string, currentRoomId: number) {
    this.similarRooms = [];

    this.roomService.getRoomsByType(type).subscribe({
      next: (rooms: any[]) => {
        this.similarRooms = rooms.filter(r => r.id !== currentRoomId);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading similar rooms', err);
      }
    });
  }


  goToRoom(id: number) {
    this.router.navigate(['/room', id]);
  }

}
