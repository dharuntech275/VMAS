# 🌿 VMAS (VMA Services)

> **Online Food Delivery Platform for Ready-Made Fresh Food Packs**  
> Wholesome family packs of Chapathi, Wheat Parotta, Plain Naan, Butter Naan, Phulka, and Poori delivered hot & fresh to your doorstep.

---

## 📌 Project Overview

Unlike traditional restaurant meal delivery services, **VMAS** specializes in delivering freshly prepared, ready-to-eat bread packs in family portions (e.g. *Chapathi - Pack of 5*, *Butter Naan - Pack of 4*).

* **Concept:** Heat & eat ready-made staple breads, eliminating kitchen kneading and preparation time.
* **Architecture:** Decoupled architecture with a Django REST Framework API backend and a Vite + React modern frontend.
* **Design Philosophy:** South Indian hospitality aesthetic featuring **Banana-leaf green (`#14452F`)**, **Turmeric gold (`#F2B705`)**, and crisp off-white with full Light & Dark mode support and Google Font `Bricolage Grotesque`.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4 (`@tailwindcss/vite`), React Router v7, Lucide React |
| **Backend** | Python 3, Django 6, Django REST Framework (DRF), `django-cors-headers`, `python-dotenv`, `gunicorn` |
| **Database** | Supabase (PostgreSQL with direct connection & SSL `sslmode=require`) / Local SQLite fallback |
| **Documentation** | Auto-generating PDF script using ReportLab (`docs/generate_pdf.py`) |

---

## 📁 Project Structure

```text
VMAS Project/
├── docs/
│   ├── VMAS_Project_Documentation.pdf   # Complete multi-step project documentation PDF
│   └── generate_pdf.py                  # ReportLab automation script
├── vmas/
│   ├── backend/                         # Django REST API
│   │   ├── config/                      # Project settings, URLs, WSGI, ASGI
│   │   ├── menu/                        # Menu items, pack catalog & seed commands
│   │   ├── orders/                      # Customer orders, line items, status tracking
│   │   ├── requirements.txt             # Python dependencies
│   │   ├── .env.example                 # Environment variables template
│   │   └── manage.py
│   └── frontend/                        # Vite + React Client
│       ├── src/
│       │   ├── api/client.js            # Fetch wrapper for DRF API
│       │   ├── components/              # Navbar, MenuCard, CartItem, Footer, StatusSteps
│       │   ├── context/                 # CartContext (localStorage) & ThemeContext & ToastContext
│       │   ├── pages/                   # Home, Menu, Cart, Checkout, TrackOrder, NotFound
│       │   ├── hooks/                   # useDocumentTitle
│       │   ├── App.jsx                  # Main router and providers
│       │   └── index.css                # Tailwind CSS v4 imports & theme tokens
│       ├── .env.example                 # Frontend API URL configuration
│       └── package.json
└── README.md
```

---

## 🚀 Setup & Installation Guide

### 1. Prerequisites
* **Python** 3.10+ installed
* **Node.js** 18+ and `npm` installed
* A free **Supabase** account (or local development fallback)

---

### 2. Backend Setup (Django & Supabase)

1. Navigate to the backend directory:
   ```cmd
   cd "vmas/backend"
   ```

2. Create and activate a Python virtual environment:
   ```cmd
   python -m venv venv
   venv\Scripts\activate
   ```

3. Install required packages:
   ```cmd
   pip install -r requirements.txt
   ```

4. Configure environment variables:
   * Copy `.env.example` to `.env`:
     ```cmd
     copy .env.example .env
     ```
   * Open `.env` and fill in your Supabase credentials:
     ```env
     SECRET_KEY=your-django-secret-key-here
     DEBUG=True
     ALLOWED_HOSTS=127.0.0.1,localhost

     # Supabase Connection Info (Found under Project Settings -> Database)
     DB_NAME=postgres
     DB_USER=postgres
     DB_PASSWORD=your_actual_supabase_password
     DB_HOST=db.xxxxxxxxxxxxxxxxxxxx.supabase.co
     DB_PORT=5432
     ```
   *(Note: If `.env` contains placeholder credentials, the system automatically falls back to local SQLite so development never blocks!)*

5. Run database migrations:
   ```cmd
   python manage.py migrate
   ```

6. Seed initial food packs (Chapathi, Wheat Parotta, Plain Naan, Butter Naan, Phulka, Poori):
   ```cmd
   python manage.py seed_menu
   ```

7. (Optional) Create an Admin superuser:
   ```cmd
   python manage.py createsuperuser
   ```

8. Start the Django backend server:
   ```cmd
   python manage.py runserver 127.0.0.1:8000
   ```
   *The backend will be running at:* `http://localhost:8000`

---

### 3. Frontend Setup (React & Vite)

1. Open a new terminal and navigate to the frontend directory:
   ```cmd
   cd "vmas/frontend"
   ```

2. Install dependencies:
   ```cmd
   npm install
   ```

3. Configure frontend environment variables:
   * Copy `.env.example` to `.env`:
     ```cmd
     copy .env.example .env
     ```
   * Verify the API endpoint in `.env`:
     ```env
     VITE_API_URL=http://localhost:8000/api
     ```

4. Start the frontend development server:
   ```cmd
   npm run dev
   ```
   *The client app will be accessible at:* `http://localhost:5173`

---

## 📡 REST API Documentation

### 1. `GET /api/menu/`
Returns all available ready-made food packs with current pricing.
* **Response (200 OK):**
  ```json
  [
    {
      "id": 1,
      "name": "Chapathi",
      "slug": "chapathi-pack-of-5",
      "pack_size": "Pack of 5",
      "price": "50.00",
      "image": "https://images.unsplash.com/...",
      "is_available": true
    }
  ]
  ```

---

### 2. `POST /api/orders/`
Places a new order. The backend calculates totals from database prices to prevent tampering.
* **Payload:**
  ```json
  {
    "customer_name": "Ravi Kumar",
    "phone": "9876543210",
    "address": "No. 12, Anna Nagar West, Chennai",
    "payment_method": "COD",
    "items": [
      { "menu_item": 1, "quantity": 2 },
      { "menu_item": 4, "quantity": 1 }
    ]
  }
  ```
* **Validations:**
  * `phone`: Valid 10-digit Indian mobile number (`^[6-9]\d{9}$`).
  * `address`: Minimum 8 characters.
  * `quantity`: Between 1 and 20 per item.
  * Unavailable items or empty cart will be rejected with `400 Bad Request`.
* **Response (201 Created):**
  ```json
  {
    "id": 1,
    "customer_name": "Ravi Kumar",
    "phone": "9876543210",
    "status": "RECEIVED",
    "total": "200.00",
    "items": [...]
  }
  ```

---

### 3. `GET /api/orders/<id>/?phone=XXXXXXXXXX`
Securely checks the live progress of an order.
* **Security Rule:** Query param `phone` must match the phone number in the order record. Returns **404 Not Found** on mismatch.
* **Status Lifecycle:** `RECEIVED` ➔ `PREPARING` ➔ `OUT_FOR_DELIVERY` ➔ `DELIVERED` (or `CANCELLED`).

---

## 🛡️ Django Admin Features

Access the admin dashboard at `http://localhost:8000/admin`:
* **Orders Admin:**
  * **Bulk Actions:** "Mark selected orders as Preparing", "Mark selected orders as Out for delivery", "Mark selected orders as Delivered".
  * **Editable Status:** Quick status dropdown directly in list view (`list_editable`).
  * **Filters & Drilldown:** Filter by order status, date hierarchy (`created_at`), and payment method.
  * **Search:** Search by customer name, phone number, and Order ID.
  * **Inline Line Items:** Tabular display of ordered food packs with snapshot unit prices.
* **Menu Admin:**
  * Direct web image URL input (file uploads disabled).
  * Direct availability toggle (`is_available`) in the list view.
  * Bulk action to mark items as Available / Unavailable.

---

## 🧪 Automated Testing

Run the Django automated test suite (8 comprehensive tests covering validations, calculations, and security):
```cmd
cd vmas/backend
venv\Scripts\activate
python manage.py test
```

---

## 📄 Documentation PDF Generator

Whenever steps or code changes occur, the documentation PDF can be updated using the automated ReportLab script:
```cmd
python docs/generate_pdf.py
```
*Output PDF located at:* [docs/VMAS_Project_Documentation.pdf](docs/VMAS_Project_Documentation.pdf)

---

## 📜 License
Personal Project - VMAS (VMA Services).
