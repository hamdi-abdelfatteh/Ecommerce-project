# Ecommerce Fullstack Project

## Overview

This repository contains a fullstack e-commerce application built with:

- `ecommerce-api`: NestJS backend with Prisma ORM and JWT authentication
- `ecommerce-frontend`: React + TypeScript + Vite frontend with React Router, TanStack Query, Zustand, and Tailwind CSS

The application supports user authentication, product browsing, categories, cart and checkout flows, orders, wishlist, product reviews, user profile and address management, and an admin dashboard with order management.

---

## Architecture

- `ecommerce-api`
  - NestJS application with modules for `auth`, `users`, `products`, `categories`, `cart`, `wishlist`, `orders`, `reviews`, and `admin`
  - Prisma schema configured for SQLite by default, with support for `User`, `Product`, `Category`, `CartItem`, `Wishlist`, `Order`, `OrderItem`, `Review`, `Address`, and `Payment`
  - Global API prefix: `/api`
  - JWT-based authentication and role-based authorization for admin routes
  - Rate limiting via NestJS throttler

- `ecommerce-frontend`
  - React application using Vite, TypeScript, and Tailwind CSS
  - Client-side routing with `react-router-dom`
  - API requests via Axios with authentication token injection
  - Data fetching and mutations using `@tanstack/react-query`
  - Protected routes for authenticated users and admin-only pages

---

## Tech Stack

- Backend: `NestJS`, `TypeScript`, `Prisma`, `SQLite` (default), `JWT`, `Passport`, `class-validator`
- Frontend: `React`, `TypeScript`, `Vite`, `Tailwind CSS`, `React Router`, `React Query`, `Axios`, `Zod`, `Zustand`

---

## Key Features

### Shared
- Fullstack e-commerce flow
- JWT auth with protected and admin routes
- Real-time form validation on the frontend
- Axios interceptor for auth headers and automatic logout on 401

### Backend
- Register and login users
- Browse products and categories
- Admin CRUD for products and categories
- Cart add/update/remove operations
- Wishlist add/remove/list
- Checkout and order history
- Order invoice download
- Admin dashboard and order status updates
- User profile and address management
- Product reviews with rating and comments

### Frontend
- Home page with category navigation and promotional CTA
- Product listing with search parameters
- Product detail pages with reviews and add-to-cart actions
- Login/Register screens
- Protected user pages: Cart, Checkout, Orders, Wishlist, Profile
- Admin dashboard showing order summaries and management tools

---

## Setup Guide

### Prerequisites

- Node.js installed
- npm installed
- Recommended: a modern terminal on Windows

### Backend Setup (`ecommerce-api`)

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd ecommerce-api
   npm install
   ```

2. Configure the database connection in `.env`:
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your_jwt_secret"
   PORT=3000
   ```

3. Generate Prisma client and apply the schema:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

4. Start the backend in development mode:
   ```bash
   npm run start:dev
   ```

5. The backend API will be available at:
   ```text
   http://localhost:3000/api
   ```

### Frontend Setup (`ecommerce-frontend`)

1. Open a terminal and navigate to the frontend folder:
   ```bash
   cd ecommerce-frontend
   npm install
   ```

2. Start the frontend development server:
   ```bash
   npm run dev
   ```

3. The application will typically open at:
   ```text
   http://localhost:5173
   ```

> The frontend is configured to proxy `/api` requests to `http://localhost:3000`, so API calls like `/api/products` work automatically.

---

## Running Locally

### Start backend

```bash
cd ecommerce-api
npm run start:dev
```

### Start frontend

```bash
cd ecommerce-frontend
npm run dev
```

### Build production assets

Backend:
```bash
cd ecommerce-api
npm run build
```

Frontend:
```bash
cd ecommerce-frontend
npm run build
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` — register a new user
- `POST /api/auth/login` — user login

### Users
- `GET /api/users/me` — get current user profile
- `PATCH /api/users/me` — update profile
- `GET /api/users/me/addresses` — list saved addresses
- `POST /api/users/me/addresses` — add an address
- `DELETE /api/users/me/addresses/:id` — remove an address

### Products
- `GET /api/products` — list products with query filters
- `GET /api/products/:id` — get product detail
- `POST /api/products` — create product (ADMIN)
- `PATCH /api/products/:id` — update product (ADMIN)
- `DELETE /api/products/:id` — delete product (ADMIN)

### Categories
- `GET /api/categories` — list categories
- `GET /api/categories/:id` — category detail
- `POST /api/categories` — create category (ADMIN)
- `PATCH /api/categories/:id` — update category (ADMIN)
- `DELETE /api/categories/:id` — delete category (ADMIN)

### Cart
- `GET /api/cart` — get current user cart
- `POST /api/cart` — add item to cart
- `PATCH /api/cart/:productId` — update cart item quantity
- `DELETE /api/cart/:productId` — remove item from cart

### Wishlist
- `GET /api/wishlist` — get wishlist
- `POST /api/wishlist/:productId` — add product to wishlist
- `DELETE /api/wishlist/:productId` — remove product from wishlist

### Orders
- `POST /api/orders/checkout` — place order
- `GET /api/orders` — user order history
- `GET /api/orders/:id` — specific order detail
- `GET /api/orders/:id/invoice` — download invoice
- `GET /api/orders/admin/all` — admin order list

### Admin Dashboard
- `GET /api/admin/dashboard` — admin dashboard summary
- `GET /api/admin/orders` — admin order list
- `PATCH /api/admin/orders/:id/status` — update order status

### Product Reviews
- `POST /api/products/:productId/reviews` — submit a product review

---

## Admin Access

Admin-only routes require a user with role `ADMIN`.

The backend includes admin modules for:
- dashboard metrics
- viewing all orders
- updating order status
- creating/updating products and categories

---

## Notes

- The backend uses Prisma with a default SQLite datasource. You can switch to PostgreSQL or another provider by updating `ecommerce-api/prisma/schema.prisma` and `DATABASE_URL`.
- The frontend stores the JWT token in `localStorage` and automatically attaches it to API requests.
- A failed `401 Unauthorized` response from the backend triggers logout and redirects to `/login`.
- Routing is handled client-side with protected routes for authenticated users and admin pages.

---

## Useful Commands

Backend:
```bash
cd ecommerce-api
npm install
npm run start:dev
npm run build
npm run test
npm run lint
```

Frontend:
```bash
cd ecommerce-frontend
npm install
npm run dev
npm run build
npm run preview
npm run lint
```

---

## Project Structure

- `ecommerce-api/` — NestJS server-side application
- `ecommerce-frontend/` — React client application
- `ecommerce-api/prisma/` — Prisma schema, seed scripts, migrations
- `ecommerce-api/src/` — backend modules and controllers
- `ecommerce-frontend/src/` — React pages, components, stores, and API client

---

## Contact

If you want to extend this project, add features like payment providers, product search, categories filtering, or deployment instructions for your cloud platform.
