import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChatbotComponent } from '../chatbot.component/chatbot.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  imports: [CommonModule, FormsModule,RouterModule,ChatbotComponent],

})
export class HomeComponent implements OnInit {
  rooms = [
    {
      id: 1,
      title: 'Deluxe Room',
      price: '$499 / night',
      description: 'Spacious room with king-size bed, panoramic ocean view, and luxury amenities.',
      image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      featured: true
    },
    {
      id: 2,
      title: 'Executive Suite',
      price: '$799 / night',
      description: 'Luxurious suite with separate living area, private balcony, and butler service.',
      image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      featured: true
    },
    {
      id: 3,
      title: 'Presidential Suite',
      price: '$1,499 / night',
      description: 'The ultimate luxury experience with private terrace, jacuzzi, and 24/7 concierge.',
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      featured: true
    }
  ];

  amenities = [
    {
      icon: 'fas fa-swimming-pool',
      title: 'Infinity Pool',
      description: 'Enjoy our stunning rooftop infinity pool with panoramic views of the California coastline.'
    },
    {
      icon: 'fas fa-spa',
      title: 'Spa & Wellness',
      description: 'Relax and rejuvenate at our world-class spa featuring premium treatments and therapies.'
    },
    {
      icon: 'fas fa-utensils',
      title: 'Fine Dining',
      description: 'Savor exquisite cuisine at our Michelin-starred restaurants with expert sommelier service.'
    }
  ];

  isScrolled = false;

  constructor() { }

  ngOnInit(): void {
    this.updateYear();
 if (typeof window !== 'undefined') {
    this.testImagePaths();
  }  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
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

  openBookingModal(): void {
    alert('Welcome to Royellas Hotel! Our booking system would open here. For now, please call +1 (310) 555-1234 to make a reservation.');
  }

  updateYear(): void {
    // Cette fonction pourrait être utilisée pour mettre à jour dynamiquement l'année dans le footer
    const currentYear = new Date().getFullYear();
    // Logique pour mettre à jour l'année si nécessaire
  }

  onRoomHover(roomId: number, isHovering: boolean): void {
    // Logique supplémentaire pour l'interaction avec les cartes de chambres
    console.log(`Room ${roomId} hover: ${isHovering}`);
  }
  // Dans la classe HomeComponent, ajoutez:

// Propriété pour l'année actuelle
currentYear: number = new Date().getFullYear();

// Méthodes pour la carte
openGoogleMaps(): void {
  const mapsUrl = 'https://www.google.com/maps?q=123+Luxury+Avenue,+Beverly+Hills,+CA+90210';
  window.open(mapsUrl, '_blank');
}

getDirections(): void {
  const directionsUrl = 'https://www.google.com/maps/dir//123+Luxury+Avenue,+Beverly+Hills,+CA+90210';
  window.open(directionsUrl, '_blank');
}

// Méthodes pour les réseaux sociaux
openSocial(platform: string): void {
  const urls: { [key: string]: string } = {
    facebook: 'https://facebook.com/royellashotel',
    instagram: 'https://instagram.com/royellashotel',
    twitter: 'https://twitter.com/royellashotel',
    tripadvisor: 'https://tripadvisor.com/royellashotel'
  };
  
  if (urls[platform]) {
    window.open(urls[platform], '_blank');
  } else {
    console.log('Platform not configured:', platform);
  }
}

// Méthode pour la newsletter
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

// Méthode de validation d'email
isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Méthodes pour les liens légaux
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



// Ajoutez ces méthodes à votre classe HomeComponent

// Pour la navigation vers toutes les chambres
viewAllRooms(): void {
  // Dans une application réelle, cela naviguerait vers une page dédiée
  alert('This would navigate to a dedicated rooms page. For now, you can explore our featured rooms above.');
  
  // Alternative: faire défiler jusqu'à la section des chambres
  this.scrollToSection('rooms');
}

// Méthode pour ouvrir les détails d'une chambre spécifique
openRoomDetails(roomId: number): void {
  alert(`Opening details for room ID: ${roomId}`);
  
  // Dans une application réelle:
  // this.router.navigate(['/room', roomId]);
}

// Méthode pour réserver une chambre spécifique
bookRoom(roomId: number, roomTitle: string): void {
  alert(`Booking the ${roomTitle} (ID: ${roomId})`);
  
  // Ici, vous pourriez ouvrir un modal de réservation
  // ou naviguer vers une page de réservation
}




  // Propriété pour tester différents chemins
  imageBasePath = 'assets/images/amenities/';
  
  // URLs d'images de secours (Unsplash)
  fallbackImages = {
    'infinity-pool': 'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'spa-wellness': 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'fine-dining': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'concierge': 'https://images.unsplash.com/photo-1581985673473-0784a7a44e39?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'fitness-center': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'valet-service': 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  };

  

 

  // Méthode pour obtenir le chemin d'image
  getImagePath(imageName: string): string {
    // Essayer différents chemins possibles
    const possiblePaths = [
      `${this.imageBasePath}${imageName}.jpg`,
      `${this.imageBasePath}${imageName}.png`,
      `./assets/images/amenities/${imageName}.jpg`,
      `/assets/images/amenities/${imageName}.jpg`,
      `assets/images/amenities/${imageName}.jpg`
    ];
    
    // Pour le débogage
    console.log(`Trying to load image: ${imageName}`);
    
    // Retourner le premier chemin ou l'image de secours
    return possiblePaths[0];
  }

  // Gestion des erreurs d'image
  handleImageError(event: Event, imageName: string): void {
    console.error(`Image not found: ${imageName}`);
    
    const img = event.target as HTMLImageElement;
    const parent = img.parentElement;
    
    // Utiliser l'image de secours
    if (this.fallbackImages[imageName as keyof typeof this.fallbackImages]) {
      img.src = this.fallbackImages[imageName as keyof typeof this.fallbackImages];
    } else {
      // Afficher une icône à la place
      if (parent) {
        parent.classList.add('fallback');
        const iconClass = this.getIconForAmenity(imageName);
        parent.innerHTML = `<i class="${iconClass}"></i>`;
      }
    }
  }

  // Obtenir l'icône correspondante
  private getIconForAmenity(imageName: string): string {
    const icons: { [key: string]: string } = {
      'infinity-pool': 'fas fa-swimming-pool',
      'spa-wellness': 'fas fa-spa',
      'fine-dining': 'fas fa-utensils',
      'concierge': 'fas fa-concierge-bell',
      'fitness-center': 'fas fa-dumbbell',
      'valet-service': 'fas fa-car'
    };
    
    return icons[imageName] || 'fas fa-star';
  }

  // Tester les chemins d'images
  private testImagePaths(): void {
    const testImages = [
      'infinity-pool',
      'spa-wellness', 
      'fine-dining',
      'concierge',
      'fitness-center',
      'valet-service'
    ];
    
    testImages.forEach(image => {
      const img = new Image();
      img.onload = () => console.log(`✓ Image found: ${image}`);
      img.onerror = () => console.error(`✗ Image not found: ${image}`);
      img.src = this.getImagePath(image);
    });
  }


  // Ajoutez ces méthodes à votre classe HomeComponent



contactUs(): void {
  // Naviguer vers la section contact
  this.scrollToSection('contact');
  // Ou ouvrir un formulaire de contact
}

// Animation pour les cartes au survol
onAmenityHover(event: Event): void {
  const card = event.currentTarget as HTMLElement;
  card.style.transform = 'translateY(-15px)';
}

onAmenityLeave(event: Event): void {
  const card = event.currentTarget as HTMLElement;
  card.style.transform = 'translateY(0)';
}
}