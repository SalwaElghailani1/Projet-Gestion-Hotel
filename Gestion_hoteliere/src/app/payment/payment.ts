import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ReservationService } from '../services/reservation.service';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './payment.html',
  styleUrls: ['./payment.css']
})
export class Payment {


  navItems = [
    { name: 'Home',  route: '/', active: false },
    { name: 'About', route: '/about', active: false },
    { name: 'Contact', route: '/contact', active: false },
    { name: 'Profile', route: '/room/:id/profil', active: false }
  ];

  clientReservations: any[] = [];

  constructor(private reservationService: ReservationService, private cdr: ChangeDetectorRef) {

    this.reservationService.getClientReservations().subscribe({
      next: (res: any) => {
        this.clientReservations = Array.isArray(res) ? res : res.reservations || [];
        this.cdr.detectChanges();
        console.log('Reservations loaded in Payment:', this.clientReservations);
      },
      error: err => console.error(err)
    });
  }

}
