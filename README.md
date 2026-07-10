# Popsicle Stories — Frozen Treats Ordering Website

The official website for **Popsicle Stories** (📍 Thiruvallur · [@popsicle__stories](https://www.instagram.com/popsicle__stories)) — *Sweet Stories, Frozen* 🍦

A complete food-ordering platform built with vanilla HTML, CSS, and JavaScript. Features a full customer ordering flow, admin dashboard, payment simulation with failure handling, reward points, coupons, and persistent state via localStorage.

## Quick Start

1. Clone or download this repository
2. Open `index.html` in a modern browser (Chrome, Firefox, Edge, Safari)
3. No build step, npm install, or server required — works with `file://` or any static file server

### Optional: Local Server

```bash
# Python 3
python -m http.server 8080

# Node.js (npx)
npx serve .

# PHP
php -S localhost:8080
```

Then visit `http://localhost:8080`

## Demo Credentials

| Role     | Email                       | Password    | Redirects To |
|----------|-----------------------------|-------------|--------------|
| Customer | `customer@test.com`         | `Test@123`  | menu.html    |
| Admin    | `admin@popsiclestories.in`  | `Admin@123` | admin.html   |

You can also create a new customer account via the Sign Up modal on the login page.

> Note: app state is stored in localStorage under `ps_*` keys and seeds itself automatically on first load.

## Coupon Codes

| Code       | Discount              | Conditions                        |
|------------|-----------------------|-----------------------------------|
| `SWEET20`  | 20% off (max ₹100)    | Any order                         |
| `FLAT50`   | ₹50 flat off          | Orders above ₹299                 |
| `KUNAFA10` | 10% off               | Kunafa Specials category only     |

## Reward Points

- Earn **1 point per ₹10** spent on successful orders
- **1 point = ₹1** redemption value
- Redeem up to **50% of the bill** at checkout
- Demo customer starts with **120 points**

## Payment & Failed Payment Testing

The checkout includes a simulated payment gateway with realistic failure handling.

### Random Failure (~30%)
Click **Pay Now** — approximately 30% of attempts will fail randomly with reasons like network errors or gateway timeouts. (Cash on Delivery never fails randomly — there is no gateway.)

### Force Failure (Demo)
Click **Simulate Failure (Demo)** to always trigger a payment failure.

### On Failure
- Cart items are **preserved**
- Applied coupon, reward redemption, delivery selection, and address all **remain intact**
- Options: **Retry Payment** or **Back to Cart**

### On Success
- Animated confirmation with order ID and ETA
- Cart clears only after successful payment
- Reward points credited
- Option to rate your order (updates item review count)

## Full Test Flow

1. Open `index.html` → browse signature popsicles → add items to cart
2. Go to `menu.html` → filter by category, search, toggle veg-only, sort
3. Open `cart.html` → adjust quantities, apply `SWEET20`, redeem points
4. Select Express delivery → add address → proceed to payment
5. Click **Simulate Failure** → verify cart is intact → retry → succeed
6. Submit order feedback → check review appears on the item in the menu
7. Login as admin → add a new popsicle → verify it appears on the customer menu

## Project Structure

```
├── index.html          # Home page
├── menu.html           # Menu & ordering
├── cart.html           # Cart & checkout
├── login.html          # Customer & admin auth
├── about.html          # About, team, contact
├── admin.html          # Admin dashboard
├── css/
│   └── styles.css      # Design system & all styles
├── js/
│   ├── data.js         # Seed data (menu, coupons, users)
│   ├── api.js          # Data access abstraction (backend-ready)
│   ├── auth.js         # Authentication & session
│   ├── cart.js         # Cart & pricing logic
│   ├── app.js          # Shared UI utilities
│   └── admin.js        # Admin dashboard logic
└── README.md
```

## Backend Integration

All data access goes through `api.js`. Each function is documented with its future REST endpoint mapping. To connect a Laravel (or any) backend:

1. Replace mock function bodies in `api.js` with `fetch()` calls
2. Keep the same function signatures and return shapes
3. No UI code changes needed

Example mappings:
- `getMenu()` → `GET /api/v1/menu`
- `login()` → `POST /api/v1/auth/login`
- `placeOrder()` → `POST /api/v1/orders`
- `processPayment()` → `POST /api/v1/payments/process`

## Design System

- **Primary:** #C4213C (berry red)
- **Accent:** #E0A82E (caramel gold)
- **Dark:** #1A0E08 (chocolate)
- **Background:** #FFF8F1 (vanilla cream)
- **Fonts:** Pacifico (wordmark), Playfair Display (headings), Inter (body)
- **Breakpoints:** 480px, 768px, 1024px, 1440px
- **Currency:** Indian Rupee (₹) with `en-IN` locale formatting

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

Built for Popsicle Stories. All rights reserved.
