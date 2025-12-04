import { BookingStatus } from '@prisma/client';

export interface CreateBookingDto {
  roomId: number;
  startDate: string; 
  endDate: string;   
}

export interface UpdateBookingStatusDto {
  status: BookingStatus;
}
