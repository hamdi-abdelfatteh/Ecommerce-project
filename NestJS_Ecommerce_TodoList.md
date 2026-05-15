# NestJS E-commerce Mini Project - Todo List

This Todo List is based on the provided project requirements, adapted for a **Mini Project** with a **Mock Payment** system instead of real payment integrations.

---

## 🏗️ Phase 1: Architecture & Authentication
* [ ] **Initialize NestJS Project:** Set up the project with a database (PostgreSQL/MySQL) Prisma [cite: 1, 94].
* [ ] **Database Schema:** Define core entities for Users, Products, Categories, and Orders [cite: 2, 56, 68].
* [ ] **JWT Authentication:** Implement secure login and registration [cite: 4, 5, 94].
* [ ] **Role-Based Access Control (RBAC):** Set up roles for **Admin** and **Customer** to protect specific routes [cite: 67, 95].
* [ ] **Security Basics:** Add Input Validation (DTOs) and Rate Limiting [cite: 97, 98].

## 📦 Phase 2: Catalog & Product Management
* [ ] **Category CRUD:** Create, read, update, and delete categories and subcategories [cite: 11, 12, 62].
* [ ] **Product CRUD:** Implement full product management for the Admin [cite: 57, 58, 59].
* [ ] **Search & Filtering:** Build endpoints to search products and filter by price or brand [cite: 15, 16].
* [ ] **Sorting:** Enable sorting by price (low/high) and newest arrivals [cite: 17].

## 🛒 Phase 3: Shopping Cart & User Profile
* [ ] **Profile Management:** Endpoints for updating user info and managing multiple addresses [cite: 7, 9].
* [ ] **Shopping Cart:** Implement add, remove, and update quantity logic [cite: 19, 20, 21].
* [ ] **Wishlist:** Allow users to save products for later [cite: 24, 25].
* [ ] **Product Reviews:** Enable customers to rate and review products [cite: 43, 44].

## 💳 Phase 4: Checkout & Mock Payment
* [ ] **Order Creation:** Logic to convert cart items into a pending order [cite: 29, 36].
* [ ] **Mock Payment Integration:**
    * Create a `PaymentService` that simulates a gateway.
    * Logic: If `cardNumber === '1234'`, return `SUCCESS`, else return `FAILED`.
    * Update order status to `PAID` upon success [cite: 33, 70].
* [ ] **Order Tracking:** Allow users to view their order history and current status [cite: 37, 38].
* [ ] **Invoice Generation:** Generate a basic summary or PDF invoice [cite: 35, 41].

## 📊 Phase 5: Admin Panel & UX
* [ ] **Admin Dashboard:** Simple stats for total sales, total users, and revenue [cite: 51, 52, 53, 54].
* [ ] **Order Management:** Admin ability to manually change order status (Shipped, Delivered) [cite: 69, 70].
* [ ] **UX Enhancements:** Implement skeleton loaders and lazy loading patterns for the frontend [cite: 103, 104].

---

## 🤖 Recommended AI Prompt:
> "I am building a **NestJS E-commerce mini project**. Please help me start with **Phase 1**. I need the code for a PostgreSQL database schema using TypeORM/Prisma for **Users** (Admin/Customer roles) and **JWT Authentication**. We will use a **Mock Payment** service later."
