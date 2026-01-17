export interface Reservation {
  idReservation: number;
  client_id: number;
  chambre_id: number;
  dateDebut: string;
  dateFin: string;
  statut: string;
  nombrePersonnes: number;
  typeChambre: string;
  photoActeMariage?: string;
  totalPrix: number;
}
