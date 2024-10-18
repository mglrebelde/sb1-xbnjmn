import { Timestamp } from 'firebase/firestore';

export interface Business {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  address: string;
  contactInfo: {
    phone: string;
    email: string;
  };
  website: string;
  operatingHours: {
    [key: string]: string;
  };
  photos: string[];
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  rating: number;
  latitude: number;
  longitude: number;
  ownerId?: string;
  isSponsored: boolean;
  isFeatured: boolean;
  promotionEndDate?: Timestamp;
  aimag?: string;
  soum?: string;
}

// ... (rest of the file remains unchanged)