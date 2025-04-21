export interface KomoditasItem {
  // Required fields from Convex schema
  _id: string;
  _creationTime: number;
  name: string;
  category: string;
  unit: string;
  pricePerUnit: number;
  stock: number;
  createdBy: string;
  updatedAt: number;

  // Optional fields from Convex schema
  description?: string;
  imageUrl: string;

  // UI compatibility fields with default values
  id: string;
  type: string;
  quantity: number;
  location: string;
  grade: string;
  createdAt: string;
}
