
export interface CreateRoomDto {
  name: string;
  price: number;
  capacity: number;
}

export interface UpdateRoomDto {
  name?: string | undefined;
  price?: number | undefined;
  capacity?: number | undefined;
  status?: string | undefined;
}

export interface FilterRoomsDto {
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  capacity?: number | undefined;
  startDate?: string | undefined;
  endDate?: string | undefined;
}
