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

export interface ItemImage {
  id: number;
  image: string;
  is_cover: boolean;
  order: number;
}

export interface ItemListItem {
  id: number;
  title: string;
  slug: string;
  campus: string;
  category: string;
  condition: string;
  price: string;
  is_distress_sale: boolean;
  discount_percentage: string | null;
  status: string;
  is_featured: boolean;
  cover_image: string | null;
}

export interface ItemCategory {
  id: number;
  name: string;
  slug: string;
}

export interface ItemDetail {
  id: number;
  title: string;
  slug: string;
  campus: string;
  category: ItemCategory;
  condition: string;
  price: string;
  description: string;
  is_distress_sale: boolean;
  distress_reason: string;
  discount_percentage: string | null;
  images: ItemImage[];
  status: string;
  is_featured: boolean;
  created_at: string;
}
export interface RoommateRequestItem {
  id: number;
  student_name: string;
  campus: string;
  preferred_location: string;
  linked_property: number | null;
  linked_property_title: string | null;
  gender_preference: string;
  budget_min: string | null;
  budget_max: string | null;
  move_in_date: string | null;
  description: string;
  status: string;
  created_at: string;
}
export interface AnalyticsSummary {
  daily_views: { day: string; count: number }[];
  top_properties: { title: string; view_count: number }[];
  top_items: { title: string; view_count: number }[];
  transaction_status_breakdown: { status: string; count: number }[];
  completed_revenue: number;
  total_views_7d: number;
}