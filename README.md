# Mini Room Reservation System – Backend API

## Overview

This project provides a backend service for a mini room reservation system. It supports user authentication, role-based authorization, room management, room availability search with date filtering, and booking lifecycle with prevention of overlapping bookings.

### Roles Supported

- **OWNER**: Manages rooms and views bookings
- **GUEST**: Searches rooms, creates bookings, cancels bookings
- **ADMIN**: Views all bookings

## Tech Stack

- Node.js with TypeScript
- Express.js
- Prisma ORM
- MySQL (using Docker)
- JWT authentication

## Project Structure

```
src/
├── auth/
├── bookings/
├── rooms/
├── users/
└── shared/
prisma/
└── schema.prisma
README.md
.env.example
```

## Docker Setup

### First Time Setup

```bash
docker run --name mini-room-mysql \
  -e MYSQL_ROOT_PASSWORD=pass123 \
  -e MYSQL_DATABASE=mini_room_reservation \
  -p 3307:3306 \
  -d mysql:8
```

### Start Existing Container

```bash
docker start mini-room-mysql
```

## Installation and Running

```bash
# Install dependencies
npm install

# Run database migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Start development server
npm run dev
```

**API Base URL**: `http://localhost:3000`

## Roles and Permissions

| Role | Permissions |
|------|-------------|
| **OWNER** | Create and update rooms, view bookings for owned rooms |
| **GUEST** | Search rooms, create bookings, cancel own bookings |
| **ADMIN** | View all bookings |

## Authentication

All protected endpoints require an `Authorization` header with a Bearer token:

```
Authorization: Bearer <your_jwt_token>
```

### Register User

**POST** `/api/auth/register`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123",
  "role": "GUEST"
}
```

### Login User

**POST** `/api/auth/login`

```json
{
  "email": "john@example.com",
  "password": "securepass123"
}
```

## API Endpoints

### Users

#### Get Current User

**GET** `/api/users/me`

Returns the authenticated user's profile.

---

### Rooms

#### Create Room (Owner Only)

**POST** `/api/rooms`

```json
{
  "name": "Room 101",
  "price": 100,
  "capacity": 2
}
```

#### Update Room (Owner Only)

**PUT** `/api/rooms/:id`

```json
{
  "name": "Updated Room 101",
  "price": 120,
  "capacity": 3
}
```

#### Get Owned Rooms

**GET** `/api/rooms/me`

Returns all rooms owned by the authenticated user.

#### Search Rooms (Any Authenticated User)

**GET** `/api/rooms`

**Query Parameters:**

- `minPrice`: Minimum room price
- `maxPrice`: Maximum room price
- `capacity`: Required capacity
- `startDate`: Booking start date (ISO 8601 format)
- `endDate`: Booking end date (ISO 8601 format)

**Example:**

```
GET /api/rooms?minPrice=50&maxPrice=150&capacity=2&startDate=2025-12-10T12:00:00.000Z&endDate=2025-12-12T10:00:00.000Z
```

Filters rooms based on price, capacity, and availability without overlapping bookings.

---

### Bookings

#### Create Booking (Guest)

**POST** `/api/bookings`

```json
{
  "roomId": 1,
  "startDate": "2025-12-10T12:00:00.000Z",
  "endDate": "2025-12-12T10:00:00.000Z"
}
```

#### View Own Bookings (Guest)

**GET** `/api/bookings/guest/me`

Returns all bookings created by the authenticated guest.

#### View Bookings for Owned Rooms (Owner)

**GET** `/api/bookings/owner/my-rooms`

Returns all bookings for rooms owned by the authenticated owner.

#### View All Bookings (Admin)

**GET** `/api/bookings/admin`

Returns all bookings in the system.

#### Cancel Booking

**PATCH** `/api/bookings/:id/cancel`

Cancellation allowed by:
- Guest who created the booking
- Owner of the room
- Admin

**Note**: Cancelled bookings do not block room availability.

---

## Data Models

### User

| Field | Type | Description |
|-------|------|-------------|
| id | Int | Primary key |
| name | String | User's full name |
| email | String | Unique email address |
| password | String | Hashed password |
| role | Enum | GUEST, OWNER, or ADMIN |
| createdAt | DateTime | Account creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### Room

| Field | Type | Description |
|-------|------|-------------|
| id | Int | Primary key |
| name | String | Room name/number |
| price | Float | Price per night |
| capacity | Int | Maximum occupancy |
| status | Enum | AVAILABLE or UNAVAILABLE |
| ownerId | Int | Foreign key to User |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### Booking

| Field | Type | Description |
|-------|------|-------------|
| id | Int | Primary key |
| roomId | Int | Foreign key to Room |
| guestId | Int | Foreign key to User |
| startDate | DateTime | Booking start date/time |
| endDate | DateTime | Booking end date/time |
| status | Enum | CONFIRMED or CANCELLED |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

## Booking Logic

- **Prevent Overlapping Bookings**: System validates that no active bookings exist for the requested date range
- **Date Range Validation**: End date must be after start date
- **Cancelled Bookings**: Do not block room availability
- **Owner Access**: Can view all bookings for their owned rooms
- **Admin Access**: Can view all bookings in the system

## Error Handling

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Invalid input or validation error |
| 401 | Unauthorized - Missing or invalid authentication token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource does not exist |
| 409 | Conflict - Overlapping booking attempt |

## Postman Testing

The API has been tested with Postman covering:

- User authentication (registration and login)
- Room operations (create, update, search)
- Availability filtering with date ranges
- Booking creation and cancellation
- Owner and admin views

A Postman collection can be exported for testing purposes.

## Manual Test Procedure

1. Register users with different roles (GUEST, OWNER, ADMIN)
2. Login to obtain JWT tokens
3. Create rooms as OWNER
4. Search available rooms with date filters
5. Create a booking as GUEST
6. Attempt to create an overlapping booking (should be rejected)
7. Cancel the booking
8. Search rooms again to verify availability

## Repository Notes

- Backend API only
- No unrelated features included
- Do not commit `.env` file
- Include `.env.example` and `README.md`

## License

Created for educational backend development training.

---

