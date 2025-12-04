export interface SafeRoom {
  id: number;
  name: string;
  price: number;
  capacity: number;
  status: string;
  ownerId: number;
  createdAt: Date;
  updatedAt: Date;
}
