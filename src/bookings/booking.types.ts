import { BookingStatus } from '@prisma/client';

export interface SafeBooking {
  id: number;
  roomId: number;
  guestId: number;
  startDate: Date;
  endDate: Date;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
}
