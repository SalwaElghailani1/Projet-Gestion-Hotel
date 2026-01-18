import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReservationService } from '../services/reservation.service';
import { ChangeDetectorRef } from '@angular/core';
import { jsPDF } from 'jspdf';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './payment.html',
  styleUrls: ['./payment.css']
})
export class Payment implements OnInit {
  clientName: string = '';
  showModal = false;
  selectedReservation: any = null;
  processing = false;
  paymentSuccess = false;
  paymentError = '';
  paymentMethod: string = 'CARD';

  // IMPORTANT: Track payment method per reservation
  reservationPaymentMethods: Map<number, string> = new Map();

  cardNumber: string = '';
  cardExpiry: string = '';
  cardCVV: string = '';

  currentUser: any = {};
  paidReservations: number[] = [];
  clientReservations: any[] = [];

  navItems = [
    { name: 'Accueil', route: '/', active: false },
    { name: 'À propos', route: '/about', active: false },
    { name: 'Contact', route: '/contact', active: false },
    { name: 'Profil', route: '/profile', active: false }
  ];

  constructor(
    private reservationService: ReservationService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadUserInfo();
    this.loadPaidReservationsFromStorage(); // CHANGEMENT ICI
    this.loadClientReservations();
    this.clientName = this.authService.getUserName();
  }

  loadUserInfo() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.currentUser = JSON.parse(userStr);
    }
  }

  // NOUVELLE MÉTHODE: Charger les réservations payées depuis localStorage
  loadPaidReservationsFromStorage() {
    const savedPaid = localStorage.getItem('paidReservations');
    if (savedPaid) {
      this.paidReservations = JSON.parse(savedPaid);
    }
  }

  // NOUVELLE MÉTHODE: Sauvegarder les réservations payées dans localStorage
  savePaidReservationsToStorage() {
    localStorage.setItem('paidReservations', JSON.stringify(this.paidReservations));
  }

  loadClientReservations() {
    this.reservationService.getClientReservations().subscribe({
      next: (res: any) => {
        this.clientReservations = Array.isArray(res) ? res : res.reservations || [];

        // NE PAS écraser paidReservations venant de localStorage
        // On combine avec les statuts du serveur
        const serverPaid = this.clientReservations
          .filter(r => r.statut === 'CONFIRMED' || r.statut === 'PAID')
          .map(r => r.idReservation);

        // Fusionner les deux listes (éviter les doublons)
        this.paidReservations = [...new Set([...this.paidReservations, ...serverPaid])];

        // Sauvegarder la liste fusionnée
        this.savePaidReservationsToStorage();

        // Load payment methods from backend or localStorage
        this.loadPaymentMethods();
        this.cdr.detectChanges();
      },
      error: err => console.error(err)
    });
  }

  loadPaymentMethods() {
    // Try to load saved payment methods
    const savedMethods = localStorage.getItem('reservationPaymentMethods');
    if (savedMethods) {
      this.reservationPaymentMethods = new Map(JSON.parse(savedMethods));
    }
  }

  savePaymentMethod(reservationId: number, method: string) {
    this.reservationPaymentMethods.set(reservationId, method);
    localStorage.setItem('reservationPaymentMethods',
      JSON.stringify(Array.from(this.reservationPaymentMethods.entries()))
    );
  }

  getPaymentMethodForReservation(reservationId: number): string {
    return this.reservationPaymentMethods.get(reservationId) || 'Carte bancaire';
  }

  calculateNights(dateDebut: string, dateFin: string): number {
    const start = new Date(dateDebut);
    const end = new Date(dateFin);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getStatusClass(statut: string): string {
    switch(statut?.toUpperCase()) {
      case 'ACCEPTED': return 'info';
      case 'CONFIRMED':
      case 'PAID': return 'success';
      case 'PENDING': return 'warning';
      case 'CANCELLED': return 'danger';
      default: return 'secondary';
    }
  }

  isReservationPaid(reservation: any): boolean {
    if (!reservation) return false;
    return reservation.statut === 'CONFIRMED' ||
      reservation.statut === 'PAID' ||
      this.paidReservations.includes(reservation.idReservation);
  }

  formatCardNumber() {
    let value = this.cardNumber.replace(/\D/g, '');
    if (value.length > 16) value = value.substring(0, 16);

    const groups = [];
    for (let i = 0; i < value.length; i += 4) {
      groups.push(value.substring(i, i + 4));
    }
    this.cardNumber = groups.join(' ');
  }

  formatExpiry() {
    let value = this.cardExpiry.replace(/\D/g, '');
    if (value.length > 4) value = value.substring(0, 4);

    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    }
    this.cardExpiry = value;
  }

  openPaymentModal(res: any) {
    if (this.isReservationPaid(res)) {
      alert('Cette réservation est déjà payée!');
      return;
    }
    this.selectedReservation = res;
    this.paymentMethod = this.reservationPaymentMethods.get(res.idReservation) || 'CARD';
    this.showModal = true;
    this.paymentSuccess = false;
    this.paymentError = '';
  }

  closeModal() {
    this.showModal = false;
    this.resetForm();
  }

  resetForm() {
    this.cardNumber = '';
    this.cardExpiry = '';
    this.cardCVV = '';
    this.processing = false;
    this.paymentSuccess = false;
    this.paymentError = '';
  }

  isAlreadyPaid(): boolean {
    if (!this.selectedReservation) return false;
    return this.isReservationPaid(this.selectedReservation);
  }

  validatePayment(): { isValid: boolean; error?: string } {
    if (this.paymentMethod === 'CARD') {
      if (!this.cardNumber || !this.cardExpiry || !this.cardCVV) {
        return { isValid: false, error: 'Veuillez remplir tous les champs de la carte' };
      }
      const cleanCard = this.cardNumber.replace(/\s/g, '');
      if (cleanCard.length !== 16 || !/^\d+$/.test(cleanCard)) {
        return { isValid: false, error: 'Numéro de carte invalide (16 chiffres requis)' };
      }
      if (!/^\d{2}\/\d{2}$/.test(this.cardExpiry)) {
        return { isValid: false, error: 'Date d\'expiration invalide (MM/AA)' };
      }
      if (this.cardCVV.length !== 3 || !/^\d+$/.test(this.cardCVV)) {
        return { isValid: false, error: 'CVV invalide (3 chiffres requis)' };
      }
    }

    return { isValid: true };
  }

  async processPayment() {
    this.processing = true;
    this.paymentError = '';

    const validation = this.validatePayment();
    if (!validation.isValid) {
      this.paymentError = validation.error || 'Données de paiement invalides';
      this.processing = false;
      return;
    }

    // Save the payment method for this reservation
    this.savePaymentMethod(this.selectedReservation.idReservation, this.paymentMethod);

    const paymentData: any = {
      facture_id: this.selectedReservation.idReservation,
      montant: this.selectedReservation.totalPrix,
      mode: this.paymentMethod
    };

    if (this.paymentMethod === 'CARD') {
      paymentData.card_details = {
        number: this.cardNumber.replace(/\s/g, ''),
        expiry: this.cardExpiry,
        cvv: this.cardCVV
      };
    }

    try {
      const response = await fetch('http://localhost:8090/paiements/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();

      if (result.statut === 'VALIDE') {
        await this.handlePaymentSuccess();
      } else {
        this.paymentError = 'Paiement échoué, veuillez réessayer';
        this.processing = false;
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      this.paymentError = error.message || 'Erreur de connexion au serveur';
      this.processing = false;
    }
  }

  processPayPal() {
    this.processing = true;
    this.paymentError = '';

    // Save payment method
    this.savePaymentMethod(this.selectedReservation.idReservation, 'PAYPAL');

    setTimeout(() => {
      this.handlePaymentSuccess();
    }, 2000);
  }

  async handlePaymentSuccess() {
    this.paymentSuccess = true;

    try {
      await this.updateReservationStatus(
        this.selectedReservation.idReservation,
        'CONFIRMED'
      );
    } catch (e) {
      console.error('Status update failed, but payment OK');
    }

    // AJOUTER à la liste des payés
    this.paidReservations.push(this.selectedReservation.idReservation);

    // SAUVEGARDER dans localStorage
    this.savePaidReservationsToStorage();

    const index = this.clientReservations.findIndex(
      r => r.idReservation === this.selectedReservation.idReservation
    );
    if (index !== -1) {
      this.clientReservations[index].statut = 'CONFIRMED';
    }

    this.cdr.detectChanges();

    // Fermer automatiquement après 3 secondes
    setTimeout(() => {
      this.closeModal();
    }, 3000);
  }

  async updateReservationStatus(reservationId: number, newStatus: string) {
    try {
      const response = await fetch(`http://localhost:3000/api/reservations/${reservationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ statut: newStatus })
      });
      if (!response.ok) throw new Error('Failed to update reservation status');
      console.log('Reservation status updated');
    } catch (error) {
      console.error('Error updating reservation:', error);
    }
  }

  downloadInvoice() {
    this.generateInvoice(this.selectedReservation);
  }

  downloadReservationInvoice(reservation: any) {
    this.generateInvoice(reservation);
  }

  private generateInvoice(reservation: any) {
    if (!reservation) return;

    const formatDate = (dateString: string): string => {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR');
    };

    const invoiceData = {
      invoiceNumber: `INV-${reservation.idReservation}-${new Date().getFullYear()}`,
      date: new Date().toLocaleDateString('fr-FR'),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
      clientName: this.clientName || 'Client',
      clientEmail: this.currentUser?.email || '',
      roomNumber: reservation.chambre?.numero,
      roomType: reservation.chambre?.type || reservation.typeChambre,
      nights: this.calculateNights(reservation.dateDebut, reservation.dateFin),
      total: reservation.totalPrix,
      paymentMethod: this.getPaymentMethodLabelForInvoice(reservation.idReservation),
      checkIn: formatDate(reservation.dateDebut),
      checkOut: formatDate(reservation.dateFin),
      reservationId: reservation.idReservation
    };

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // ========== VARIABLES ==========
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const contentWidth = pageWidth - (2 * margin);

    // ========== COLORS ==========
    const black = [0, 0, 0];
    const gold = [201, 169, 110];
    const beige = [245, 239, 229];
    const darkGray = [60, 60, 60];
    const lightGray = [180, 180, 180];

    // ========== BACKGROUND (BEIGE) ==========
    doc.setFillColor(beige[0], beige[1], beige[2]);
    doc.rect(0, 0, pageWidth, doc.internal.pageSize.height, 'F');

    // ========== HEADER ==========
    doc.setFillColor(black[0], black[1], black[2]);
    doc.rect(0, 0, pageWidth, 70, 'F');

    // Hotel Name
    // Logo et Titre - ROYELLAS HOTEL à gauche en blanc, FACTURE OFFICIELLE à droite en doré
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');

    // "ROYELLAS" en blanc
    doc.setTextColor(255, 255, 255);
    doc.text('ROYELLAS', margin, 25);

    // Calculer largeur du texte "ROYELLAS"
    const RoyellasWidth = doc.getTextWidth('ROYELLAS');

    // "HOTEL" en doré juste après
    doc.setTextColor(201, 169, 110); // doré
    doc.text('HOTEL', margin + RoyellasWidth + 5, 25); // +5 pour un petit espace

    doc.setFontSize(16);
    doc.setTextColor(gold[0], gold[1], gold[2]); // Doré pour FACTURE OFFICIELLE
    doc.text('OFFICIAL INVOICE', pageWidth - margin, 25, { align: 'right' });

    // ========== INVOICE INFO ==========
    doc.setFontSize(10);
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.text('Invoice N°:', margin, 50);
    doc.text('Invoice Date:', margin, 55);
    doc.text('Due Date:', margin, 60);

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text(invoiceData.invoiceNumber, margin + 30, 50);
    doc.text(invoiceData.date, margin + 30, 55);
    doc.text(invoiceData.dueDate, margin + 30, 60);

    // ========== CLIENT INFO ==========
    doc.setFillColor(gold[0], gold[1], gold[2]);
    doc.roundedRect(margin, 80, contentWidth / 2 - 10, 50, 3, 3, 'F');

    doc.setFontSize(14);
    doc.setTextColor(black[0], black[1], black[2]);
    doc.text('CLIENT INFORMATION ', margin + 10, 95);

    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(`Name: ${invoiceData.clientName}`, margin + 10, 105);
    doc.text(`Email: ${invoiceData.clientEmail}`, margin + 10, 112);
    doc.text(`Reservation ID: #${invoiceData.reservationId}`, margin + 10, 119);

    // ========== HOTEL INFO ==========
    doc.setFillColor(black[0], black[1], black[2]);
    doc.roundedRect(pageWidth / 2, 80, contentWidth / 2 - 10, 50, 3, 3, 'F');

    doc.setFontSize(14);

    // "ROYELLAS" en noir (visible sur beige)
    doc.setTextColor(255, 255, 255);
    doc.text('ROYELLAS', pageWidth / 2 + 10, 88);

    // "HOTEL" en doré
    doc.setTextColor(gold[0], gold[1], gold[2]);
    const royellasWidth = doc.getTextWidth('ROYELLAS');
    doc.text('HOTEL', pageWidth / 2 + 10 + royellasWidth + 5, 88);

    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(' Marrakech, Morocco', pageWidth / 2 + 10, 98);
    doc.text(' +212 5 00 00 00 00', pageWidth / 2 + 10, 105);
    doc.text(' contact@royellashotel.com', pageWidth / 2 + 10, 112);
    doc.text(' www.royellashotel.com', pageWidth / 2 + 10, 119);

    // ========== RESERVATION DETAILS ==========
    const tableTop = 140;

    // Table Header
    doc.setFillColor(gold[0], gold[1], gold[2]);
    doc.rect(margin, tableTop, contentWidth, 10, 'F');

    doc.setFontSize(12);
    doc.setTextColor(black[0], black[1], black[2]);
    doc.text(' STAY DETAILS ', margin + 10, tableTop + 7);

    // Table Content
    const details = [
      { label: 'Room Number', value: invoiceData.roomNumber },
      { label: 'Room Type', value: invoiceData.roomType },
      { label: 'Check-in Date', value: invoiceData.checkIn },
      { label: 'Check-out Date', value: invoiceData.checkOut },
      { label: 'Nights', value: invoiceData.nights },
      { label: 'Payment Method', value: invoiceData.paymentMethod }
    ];

    let y = tableTop + 25;
    details.forEach((detail, index) => {
      if (index % 2 === 0) {
        doc.setFillColor(beige[0], beige[1], beige[2]);
      } else {
        doc.setFillColor(245, 245, 245);
      }
      doc.rect(margin, y - 5, contentWidth, 15, 'F');

      doc.setFontSize(10);
      doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      doc.text(detail.label, margin + 10, y);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(black[0], black[1], black[2]);
      doc.text(detail.value.toString(), margin + contentWidth - 20, y, { align: 'right' });

      doc.setFont('helvetica', 'normal');
      y += 15;
    });

    // ========== TOTAL SECTION ==========
    const totalTop = y + 10;

    doc.setFillColor(black[0], black[1], black[2]);
    doc.rect(margin + contentWidth - 100, totalTop, 100, 30, 'F');

    doc.setFontSize(12);
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.text('TOTAL AMOUNT', margin + contentWidth - 95, totalTop + 10);

    doc.setFontSize(20);
    doc.setTextColor(gold[0], gold[1], gold[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(`${invoiceData.total} MAD`, margin + contentWidth - 95, totalTop + 25);

    // ========== FOOTER ==========
    const footerTop = doc.internal.pageSize.height - 40;

    doc.setFillColor(black[0], black[1], black[2]);
    doc.rect(0, footerTop, pageWidth, 40, 'F');

    doc.setFontSize(10);
    doc.setTextColor(gold[0], gold[1], gold[2]);
    doc.text('Thank you for your trust!', pageWidth / 2, footerTop + 15, { align: 'center' });

    doc.setFontSize(8);
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.text('ROYELLAS HOTEL - Luxury Experience Since 2024', pageWidth / 2, footerTop + 25, { align: 'center' });

    // ========== WATERMARK ==========
    doc.setFontSize(60);
    doc.setTextColor(beige[0], beige[1], beige[2]);
    doc.setGState(new (doc as any).GState({ opacity: 0.1 }));
    doc.text('ROYELLAS', pageWidth / 2, doc.internal.pageSize.height / 2, { align: 'center' });
    doc.setGState(new (doc as any).GState({ opacity: 1 }));

    // ========== BORDER DECORATION ==========
    doc.setDrawColor(gold[0], gold[1], gold[2]);
    doc.setLineWidth(0.5);
    doc.rect(10, 10, pageWidth - 20, doc.internal.pageSize.height - 20);

    // Save PDF
    doc.save(`facture-royellas-${invoiceData.invoiceNumber}.pdf`);
  }

  private getPaymentMethodLabelForInvoice(reservationId: number): string {
    const method = this.reservationPaymentMethods.get(reservationId);
    switch(method) {
      case 'CARD': return 'Carte bancaire';
      case 'PAYPAL': return 'PayPal';
      case 'CASH': return 'Espèces';
      case 'TRANSFER': return 'Virement bancaire';
      default: return 'Carte bancaire';
    }
  }

  getPaymentMethodLabel(): string {
    switch(this.paymentMethod) {
      case 'CARD': return 'Carte bancaire';
      case 'PAYPAL': return 'PayPal';
      case 'CASH': return 'Espèces';
      case 'TRANSFER': return 'Virement bancaire';
      default: return this.paymentMethod;
    }
  }

  refreshReservations() {
    this.reservationService.getClientReservations().subscribe({
      next: (res) => {
        this.clientReservations = Array.isArray(res) ? res : res.reservations || [];
        this.cdr.detectChanges();
      }
    });
  }
}
