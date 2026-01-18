import { Component } from '@angular/core';
import {CommonModule, NgForOf, NgIf} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import { RoomService } from '../services/room.service';
import {Observable, of, switchMap} from 'rxjs';
import { map } from 'rxjs/operators';
import {ChatbotComponent} from "../chatbot.component/chatbot.component";

@Component({
  selector: 'app-catalogue',
  standalone: true,
    imports: [NgForOf, NgIf, CommonModule, RouterModule, ChatbotComponent],
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

  openBookingModal(): void {
    alert('Welcome to Royellas Hotel! Our booking system would open here. For now, please call +1 (310) 555-1234 to make a reservation.');
  }

  openGoogleMaps(): void {
    const mapsUrl = 'https://www.google.com/maps?q=123+Luxury+Avenue,+Beverly+Hills,+CA+90210';
    window.open(mapsUrl, '_blank');
  }

  getDirections(): void {
    const directionsUrl = 'https://www.google.com/maps/dir//123+Luxury+Avenue,+Beverly+Hills,+CA+90210';
    window.open(directionsUrl, '_blank');
  }
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  subscribeNewsletter(): void {
    const emailInput = document.querySelector('.newsletter-input') as HTMLInputElement;
    if (emailInput) {
      const email = emailInput.value;
      if (this.isValidEmail(email)) {
        alert(`Thank you for subscribing to our newsletter with email: ${email}`);
        emailInput.value = '';
      } else {
        alert('Please enter a valid email address.');
      }
    }
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  currentYear: number = new Date().getFullYear();

  openPrivacyPolicy(): void {
    alert('Privacy Policy page would open here.');
    // window.open('/privacy-policy', '_blank'); // Dans une vraie application
  }

  openTerms(): void {
    alert('Terms & Conditions page would open here.');
    // window.open('/terms', '_blank'); // Dans une vraie application
  }

  openAccessibility(): void {
    alert('Accessibility Statement page would open here.');
    // window.open('/accessibility', '_blank'); // Dans une vraie application
  }
}
