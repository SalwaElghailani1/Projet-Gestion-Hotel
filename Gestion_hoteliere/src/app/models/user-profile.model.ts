export interface UserProfile {
  userId: number;
  nom: string;
  prenom: string;
  telephone: string;
  adresse: string;
  cin: string;
  metierRole: MetierRole;
  departement: string;
  dateEmbauche: Date;
  superviseurId: number;
  status: ProfileStatus;
  validatedAt?: Date;
  validatedBy?: number;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfileRequest {
  telephone: string;
  adresse: string;
  cin: string;
  metierRole: MetierRole;
  departement: string;
  dateEmbauche: Date;
  superviseurId: number;
}

export interface UserProfileResponse {
  userId: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  cin: string;
  metierRole: MetierRole;
  departement: string;
  dateEmbauche: Date;
  superviseurId: number;
  status: ProfileStatus;
  validatedAt?: Date;
  validatedBy?: number;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum MetierRole {
  DEFOULT = 'DEFOULT',
  HOUSEKEEPING = 'HOUSEKEEPING',
  RECEPTIONNISTE = 'RECEPTIONNISTE',
  MANAGER = 'MANAGER',
  MAINTENANCE = 'MAINTENANCE',
  COMPTABLE = 'COMPTABLE',
  ADMIN = 'ADMIN'
}

export enum ProfileStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  VALIDATED = 'VALIDATED',
  REJECTED = 'REJECTED'
}