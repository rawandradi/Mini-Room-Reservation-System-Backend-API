# Mini Room Reservation System – Backend API

## Overview

This project provides a backend service for a mini room reservation system built with NestJS and Prisma ORM. It supports JWT authentication, role-based authorization, room management, room availability search with filtering, and booking lifecycle with prevention of overlapping bookings.

## Roles Supported

- **OWNER**: Manages rooms and views bookings for owned rooms
- **GUEST**: Searches rooms, creates bookings, cancels own bookings
- **ADMIN**: Views all bookings for monitoring/dashboard

## Tech Stack

- Node.js + TypeScript
- NestJS (modular architecture)
- Prisma ORM
- MySQL (Docker)
- JWT authentication
- Swagger API Docs

## Project Structure

```
src/
├── app.module.ts
├── main.ts
├── prisma/
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── common/
│   ├── decorators/
│   └── guards/
├── modules/
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── dto/
│   │   └── jwt.strategy.ts
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   └── users.service.ts
│   ├── rooms/
│   │   ├── rooms.module.ts
│   │   ├── rooms.controller.ts
│   │   └── rooms.service.ts
│   └── bookings/
│       ├── bookings.module.ts
│       ├── bookings.controller.ts
│       └── bookings.service.ts
prisma/
└── schema.prisma
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
**Swagger Docs**: `http://localhost:3000/docs`

## Authentication

All protected endpoints require an `Authorization` header with a Bearer token:

```
Authorization: Bearer <your_jwt_token>
```

### Register User

**POST** `/auth/register`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123",
  "role": "GUEST"
}
```

### Login User

**POST** `/auth/login`

```json
{
  "email": "john@example.com",
  "password": "securepass123"
}
```

## API Endpoints

### Users

#### Get Current User

**GET** `/users/me`

Returns the authenticated user's profile.

---

### Rooms

#### Create Room (Owner Only)

**POST** `/rooms`

```json
{
  "name": "Room 101",
  "price": 100,
  "capacity": 2
}
```

#### Update Room (Owner Only)

**PATCH** `/rooms/:id`

```json
{
  "name": "Updated Room 101",
  "price": 120,
  "capacity": 3
}
```

#### Get All Rooms (Public)

**GET** `/rooms`

**Query Parameters:**
- `minPrice`
- `maxPrice`
- `capacity`

---

### Bookings

#### Create Booking (Guest)

**POST** `/bookings`

```json
{
  "roomId": 1,
  "startDate": "2025-12-10T12:00:00.000Z",
  "endDate": "2025-12-12T10:00:00.000Z"
}
```

#### View Own Bookings (Guest)

**GET** `/bookings/my`

#### View Bookings for Owned Rooms (Owner)

**GET** `/bookings/owner`

#### View All Bookings (Admin)

**GET** `/bookings`

#### Cancel Booking (Guest Only)

**DELETE** `/bookings/:id`

## Data Models

### User

| Field | Type | Description |
|-------|------|-------------|
| id | Int | Primary key |
| name | String | User's full name |
| email | String | Unique email address |
| password | String | Hashed password |
| role | Enum | GUEST, OWNER, ADMIN |
| createdAt | DateTime | Account creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### Room

| Field | Type | Description |
|-------|------|-------------|
| id | Int | Primary key |
| name | String | Room name |
| price | Float | Price per night |
| capacity | Int | Maximum occupancy |
| status | String | AVAILABLE or UNAVAILABLE |
| ownerId | Int | Foreign key to User |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### Booking

| Field | Type | Description |
|-------|------|-------------|
| id | Int | Primary key |
| roomId | Int | Foreign key to Room |
| guestId | Int | Foreign key to User |
| startDate | DateTime | Booking start date |
| endDate | DateTime | Booking end date |
| status | Enum | PENDING, CONFIRMED, CANCELLED |
| createdAt | DateTime | Timestamp |
| updatedAt | DateTime | Timestamp |

## Booking Logic

- Prevent overlapping bookings
- Validate date ranges (endDate > startDate)
- Cancelled bookings do not block availability
- Owner can view bookings for owned rooms
- Admin can view all bookings

## Error Handling

| Status Code | Description |
|-------------|-------------|
| 400 | Validation error |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not found |
| 409 | Overlapping booking |

## Swagger / API Docs

Interactive API documentation is available at:

**http://localhost:3000/docs**

Features:
- Endpoint descriptions
- Example request bodies
- Try-it-out feature
- Bearer auth support

## Manual Test Procedure

1. Register users with different roles
2. Login to obtain JWT tokens
3. Create rooms as OWNER
4. List rooms and apply filters
5. Create a booking as GUEST
6. Attempt overlapping booking (should fail)
7. Cancel booking
8. Verify renewed availability

---
