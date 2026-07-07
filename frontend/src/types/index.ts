export interface Campus {
  id: number;
  name: string;
  short_code: string;
  slug: string;
}

export interface PropertyImage {
  id: number;
  image: string;
  is_cover: boolean;
  order: number;
}

export interface PropertyListItem {
  id: number;
  title: string;
  slug: string;
  campus: string;
  location_area: string;
  room_type: string;
  initial_price: string;
  subsequent_price: string;
  bedrooms: number;
  bathrooms: number;
  status: string;
  is_featured: boolean;
  cover_image: string | null;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Amenity {
  id: number;
  name: string;
  icon_name: string;
}

export interface PropertyDetail {
  id: number;
  title: string;
  slug: string;
  campus: Campus;
  location_area: string;
  latitude: string | null;
  longitude: string | null;
  room_type: string;
  initial_price: string;
  subsequent_price: string;
  bedrooms: number;
  bathrooms: number;
  description: string;
  amenities: Amenity[];
  images: PropertyImage[];
  status: string;
  is_featured: boolean;
  created_at: string;
}