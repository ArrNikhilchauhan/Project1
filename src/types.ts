export interface Service {
  id: string;
  name: string;
  description: string;
  pricePerHour: number;
  image: string;
  badgeText?: string;
  icon: string;
  features?: string[];
  unit: string;
}

export interface Market {
  id: string;
  name: string;
  description: string;
  statusText: string;
  image: string;
  coordinates: { x: number; y: number };
}

export interface Assistant {
  name: string;
  avatar: string;
  rating: number;
  tripsCount: number;
  phone: string;
  status: string;
  quote: string;
}

export interface Booking {
  id: string;
  fullName: string;
  phone: string;
  marketId: string;
  marketName: string;
  bookingDate: string;
  serviceId: string;
  serviceName: string;
  durationHours: number;
  specialRequirements: string;
  totalCost: number;
  status: 'pending' | 'assigned' | 'active' | 'completed' | 'cancelled';
  assistant?: Assistant;
  bagsCount: number;
  timestamp: number;
}
