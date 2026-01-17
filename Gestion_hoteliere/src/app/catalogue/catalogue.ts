import { Component } from '@angular/core';
import {CommonModule, NgForOf, NgIf} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import { RoomService } from '../services/room.service';
import {Observable, of, switchMap} from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [NgForOf, NgIf, CommonModule, RouterModule],
  templateUrl: './catalogue.html',
  styleUrls: ['./catalogue.css'],
})
export class Catalogue  {

  navItems = [
    { name: 'Home',  route: '/', active: false },
    { name: 'About', route: '/about', active: false },
    { name: 'Contact', route: '/contact', active: false },
    { name: 'Profile', route: '/catalogue/profil', active: false }
  ];

  selectedType: string = '';
  selectedPrice: number = 2000;
  rooms$!: Observable<any[]>;

  constructor(private roomService: RoomService, private router: Router) {
    this.rooms$ = this.roomService.getRooms();
  }

  goToRoomDetails(id: number) {
    this.router.navigate(['/room', id]);
  }

  searchRoom(numero: string) {
    if (!numero) {
      this.rooms$ = this.roomService.getRooms();
      return;
    }

    this.rooms$ = this.roomService.getRoomByNumero(numero).pipe(
      map(room => room ? [room] : [])
    );
  }


  // ===== Load rooms using backend endpoints =====
  loadRooms() {
    let obs: Observable<any[]> = this.roomService.getRooms();

    // Filter by type
    if (this.selectedType) {
      obs = this.roomService.getRoomsByType(this.selectedType);
    }

    // Filter by price
    obs = obs.pipe(
      switchMap(rooms =>
        this.roomService.getRoomsByPrix(this.selectedPrice).pipe(
          map(priceRooms =>
            rooms.filter(r => priceRooms.some(pr => pr.id === r.id))
          )
        )
      )
    );

    this.rooms$ = obs;
  }

  onTypeChange(type: string) {
    this.selectedType = type;
    this.loadRooms();
  }

  onPriceChange(price: any) {
    this.selectedPrice = Number(price);
    this.loadRooms();
  }
}
