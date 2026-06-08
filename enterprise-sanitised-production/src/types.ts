export type UserRole = 'PUBLIC' | 'PARTENAIRES' | 'MAIRIE' | 'DATA_TEAM';

export interface CitizenConsent {
  location: boolean;
  analytics: boolean;
  ble: boolean;
  ai_profiling: boolean;
}

export interface Review {
  id: string;
  userName: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
}

export interface CityEvent {
  id: string;
  title: string;
  description: string;
  category: 'CULTURE' | 'ECONOMIC' | 'ECO_CSR' | 'SERVICES' | 'SPORT' | 'EMERGENCY';
  date: string;
  isToday: boolean;
  partnerId: string;
  partnerName: string;
  isPremiumPartner: boolean;
  lat: number;
  lng: number;
  views: number;
  bookingsCount: number;
  revenue: number; // in MAD
  ticketPrice: number; // in MAD
  reviews: Review[];
  featuredImage?: string;
}

export interface CitizenClaim {
  id: string;
  citizenName: string;
  category: 'CHAUSEE' | 'ECLAIRAGE' | 'DECHETS' | 'EAU_ASSAINISSEMENT' | 'AUTRE';
  title: string;
  description: string;
  status: 'OUVERT' | 'EN_COURS' | 'RESOLU';
  createdAt: string;
  location: string;
  satisfactionScore?: number; // 1 to 5 if resolved
  replies: {
    sender: 'MAIRIE' | 'CITIZEN';
    message: string;
    timestamp: string;
  }[];
}

export interface BLEMessage {
  id: string;
  senderNode: string;
  recipientNode: string;
  payload: string;
  timestamp: string;
  hmacSignature: string;
}

export interface BLEStatus {
  isConnected: boolean;
  discoveredNodes: string[];
  sentCount: number;
  receivedCount: number;
  syncInProgress: boolean;
  logs: string[];
}

export interface CNDPPrivacyLog {
  timestamp: string;
  action: string;
  affectedRole: string;
  details: string;
}

export interface PharmacyDeGarde {
  id: string;
  name: string;
  address: string;
  phone: string;
  dutyType: 'JOUR' | 'NUIT' | 'PERMANENT';
  isOpenToday: boolean;
}

export interface HospitalStatus {
  id: string;
  name: string;
  occupancyRate: number; // 0 to 100%
  availableBeds: number;
  contact: string;
}
