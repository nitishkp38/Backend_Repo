# Backend API and Database Plan

## 1. Database Tables

Use these tables in Supabase with exact capitalized names:

### Users
- id
- name
- email
- phone
- password
- role
- created_at

### Providers
- id
- user_id
- service_type
- experience
- rating
- verification_status
- available
- created_at

### Services
- id
- name
- description
- image_url
- base_price
- created_at

### Bookings
- id
- customer_id
- provider_id
- service_id
- booking_date
- duration
- address
- notes
- total_price
- status
- created_at

### Reviews
- id
- booking_id
- customer_id
- provider_id
- rating
- comment
- created_at

### Chat_Rooms
- id
- booking_id
- created_at

### Messages
- id
- room_id
- sender_id
- message
- created_at

---

## 2. Backend API Endpoints

### Authentication
- `POST /auth/register`
  - Request: `name`, `email`, `password`, `phone`, `role`
  - Response: `success`, `user` object with `id`, `name`, `email`, `role`

- `POST /auth/login`
  - Request: `email`, `password`
  - Response: `success`, `user` object with `id`, `name`, `email`, `role`

### Services
- `GET /services`
  - Returns all services
- `POST /services`
  - Request: `name`, `description`, `image_url`, `base_price`

### Providers
- `GET /providers`
  - Optional query: `service_type`, `available=true|false`
- `GET /providers/:id`
- `PATCH /providers/:id`
  - Request example: `available`, `verification_status`

### Bookings
- `POST /bookings`
  - Request: `customer_id`, `provider_id`, `service_id`, `booking_date`, `duration`, `address`, `notes`, `total_price`
- `GET /bookings`
- `GET /bookings/:id`
- `GET /bookings/customer/:customerId`
- `GET /bookings/provider/:providerId`
- `PATCH /bookings/:id/status`
  - Request: `status`
  - Status values: `PENDING`, `ACCEPTED`, `ON_THE_WAY`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`

### Reviews
- `POST /reviews`
  - Request: `booking_id`, `customer_id`, `provider_id`, `rating`, `comment`
- `GET /reviews`
  - Optional query: `provider_id`, `customer_id`, `booking_id`

### Chat
- `POST /chat/rooms`
  - Request: `booking_id`
- `GET /chat/rooms/:bookingId`
- `POST /chat/messages`
  - Request: `room_id`, `sender_id`, `message`
- `GET /chat/messages/:roomId`

---

## 3. Frontend Data Flow

- The frontend should call backend endpoints rather than access Supabase directly.
- Send JSON payloads to the routes above.
- Receive response objects containing IDs, status, and relevant table fields.
- Use `Users` for auth/profile, `Services` for browsing services, `Bookings` for order flow, `Reviews` for ratings, and `Chat_Rooms` + `Messages` for chat.

---

## 4. Important Notes

- Because table names are capitalized, every SQL query must use quoted table names:
  - `SELECT * FROM "Users";`
  - `INSERT INTO "Bookings" (...) VALUES (...);`
- The backend routes abstract these details for the frontend.
