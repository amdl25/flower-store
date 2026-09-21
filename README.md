# Flower Store – Full-Stack E-Commerce (MERN)

Online flower shop with a customer storefront, an admin panel and a REST API. Customers browse flowers and products, filter and search, manage a cart and use promo codes. Admins manage the catalog, promo codes and subscriptions.

## Features

**Storefront**
- Product catalog by category and occasion, with filtering and search
- Product page with related products from the same category
- Shopping cart, checkout flow with a simulated payment page, order confirmation
- User accounts: sign up, log in, profile (JWT authentication)
- Promo codes with a usage limit per user
- Monthly flower subscription: subscribers receive a "flower of the month" email on the 1st of every month (scheduled with node-cron)
- Newsletter subscription

**Admin panel**
- Add and list flowers, occasions and products (with image upload)
- Manage promo codes and monthly flower subscriptions

## Tech stack

| Part | Technologies |
|---|---|
| Storefront (`frontend/`) | React, React Router, styled-components, React Toastify |
| Admin panel (`admin/`) | React, Vite, React Router, Axios |
| API (`backend/`) | Node.js, Express, MongoDB with Mongoose, JWT, bcrypt, Multer, node-cron, Nodemailer |

## Project structure

```
backend/
  controllers/  entities/  routes/  middleware/
  emailService.js   email sending (monthly flower email)
  index.js          Express app, MongoDB connection, cron job
frontend/           customer storefront (Create React App)
admin/              admin panel (Vite)
```

API prefixes: `/api/products`, `/api/flowers`, `/api/occasions`, `/api/cart`, `/api/orders`, `/api/user`, `/api/promocodes`, `/api/monthlyflowersubscriptions`, `/api/subscribers`.

## Getting started

### Prerequisites
- Node.js 18 or newer
- A MongoDB database (local or MongoDB Atlas)
- For the monthly emails: an SMTP account (for example Gmail with an app password)

### Configuration
- MongoDB connection string: `backend/index.js` (`mongoose.connect(...)`)
- Email account: `backend/emailService.js`

### Run

```bash
# API (http://localhost:4000)
cd backend
npm install
node index.js

# Storefront (http://localhost:3000)
cd frontend
npm install
npm start

# Admin panel (Vite dev server)
cd admin
npm install
npm run dev
```

Uploaded product images are stored in `backend/upload/images` and served from `/images`.

## Notes
- The storefront and admin panel expect the API at `http://localhost:4000`.
- The UI is in Romanian.
