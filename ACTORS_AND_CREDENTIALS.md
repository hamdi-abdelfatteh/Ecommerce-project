# ShopNest — Actors, Capabilities & Credentials

---

## How to Create the Accounts

Once PostgreSQL is running and migrations are applied, run:

```bash
cd ecommerce-api
npx prisma migrate dev --name init   # first time only
npx prisma db seed                   # creates both accounts below
```

---

## 🔴 Actor 1 — Admin

### Credentials
| Field    | Value                  |
|----------|------------------------|
| Email    | `admin@shopnest.com`   |
| Password | `Admin@1234`           |
| Role     | `ADMIN`                |

### What the Admin can do

#### Dashboard & Analytics
- View total number of customers, orders, and products
- View total revenue from paid orders
- See the 5 most recent orders at a glance

#### Product Management
- Create new products (name, description, price, brand, stock, images, category)
- Edit any product
- Delete any product

#### Category Management
- Create top-level categories and subcategories (nested)
- Edit category names and slugs
- Delete categories

#### Order Management
- View **all** orders from all customers
- Manually update any order's status:
  - `PENDING` → `PAID` → `SHIPPED` → `DELIVERED` → `CANCELLED`

#### Access
- All customer capabilities (see below)
- Exclusive access to `GET /api/admin/dashboard`
- Exclusive access to `GET /api/admin/orders`
- Exclusive access to `PATCH /api/admin/orders/:id/status`

---

## 🔵 Actor 2 — Customer

### Credentials
| Field    | Value                    |
|----------|--------------------------|
| Email    | `customer@shopnest.com`  |
| Password | `Customer@1234`          |
| Role     | `CUSTOMER`               |

### What the Customer can do

#### Browsing (no login required)
- Browse all products
- Search products by keyword
- Filter by brand, category, min/max price
- Sort by price (low→high, high→low) or newest
- View full product detail page
- Read product reviews

#### Account
- Register a new account
- Log in / log out
- View and edit profile (first name, last name)
- Add, view, and delete shipping addresses

#### Shopping Cart
- Add products to cart (with quantity)
- Update item quantity in cart
- Remove items from cart
- View cart total

#### Wishlist
- Save products to wishlist
- Remove products from wishlist

#### Reviews
- Rate a product (1–5 stars)
- Write a text review for any product
- Delete their own review

#### Checkout & Payment
- Proceed to checkout from cart
- Select a saved shipping address
- Pay with mock card:
  - Card `1234` → **Payment SUCCESS** → order status set to `PAID`
  - Any other 4 digits → **Payment FAILED**

#### Orders
- View full order history
- View order details (items, quantities, unit prices, total)
- Track order status (PENDING / PAID / SHIPPED / DELIVERED / CANCELLED)
- Download a plain-text invoice for any order

---

## API Base URL

```
http://localhost:3000/api
```

## Frontend URL

```
http://localhost:5173
```

---

## Quick Login Test (curl)

**Admin login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@shopnest.com","password":"Admin@1234"}'
```

**Customer login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@shopnest.com","password":"Customer@1234"}'
```
