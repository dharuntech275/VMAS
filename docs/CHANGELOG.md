# 📋 VMAS Project Changelog

Step-by-step implementation log detailing every milestone, file created/modified, and verification command across the VMAS (VMA Services) project.

---

## Step 1: Backend Setup & Supabase Database Configuration
* **Date:** 2026-10-17
* **Summary:** Initialized Django project `config` in `vmas/backend`. Created virtual environment `venv` and installed dependencies (`django`, `djangorestframework`, `psycopg2-binary`, `django-cors-headers`, `python-dotenv`, `gunicorn`, `reportlab`). Created `menu` and `orders` applications. Configured `settings.py` with `python-dotenv` for loading sensitive secrets, enabled direct connection to Supabase PostgreSQL with SSL (`sslmode=require`), CORS for `http://localhost:5173`, and set `TIME_ZONE = 'Asia/Kolkata'`.
* **Files Created / Modified:**
  - `vmas/backend/requirements.txt`
  - `vmas/backend/manage.py`
  - `vmas/backend/config/settings.py`
  - `vmas/backend/config/urls.py`
  - `vmas/backend/config/wsgi.py`
  - `vmas/backend/config/asgi.py`
  - `vmas/backend/menu/` (app scaffolding)
  - `vmas/backend/orders/` (app scaffolding)
  - `vmas/backend/.env.example`
  - `vmas/backend/.gitignore`
* **Run Commands:**
  ```cmd
  cd vmas/backend
  python -m venv venv
  venv\Scripts\activate
  pip install -r requirements.txt
  python manage.py check
  ```

---

## Step 2: Django Database Models, Admin & Seed Management Command
* **Date:** 2026-10-17
* **Summary:** Defined `MenuItem` model in `menu` app with auto-generating slug, INR decimal price, and pack sizes. Defined `Order` and `OrderItem` models in `orders` app with choices for payment method (`COD`, `UPI`) and order status (`RECEIVED`, `PREPARING`, `OUT_FOR_DELIVERY`, `DELIVERED`, `CANCELLED`). Registered models in Django Admin with `OrderItemInline` and `list_editable = ('status',)`. Created `seed_menu` command to populate 6 initial food packs. Created and executed migrations.
* **Files Created / Modified:**
  - `vmas/backend/menu/models.py`
  - `vmas/backend/menu/admin.py`
  - `vmas/backend/orders/models.py`
  - `vmas/backend/orders/admin.py`
  - `vmas/backend/menu/management/commands/seed_menu.py`
  - `vmas/backend/menu/migrations/0001_initial.py`
  - `vmas/backend/orders/migrations/0001_initial.py`
* **Run Commands:**
  ```cmd
  python manage.py makemigrations
  python manage.py migrate
  python manage.py seed_menu
  python manage.py createsuperuser
  ```

---

## Step 3: REST API (Django REST Framework) & Automated Unit Tests
* **Date:** 2026-10-17
* **Summary:** Built DRF endpoints: `GET /api/menu/` for available food packs, `POST /api/orders/` with backend total calculation, price snapshotting in `OrderItem`, and `transaction.atomic()`. Built `GET /api/orders/<id>/?phone=...` tracking endpoint enforcing 404 on phone mismatch. Added strict validations (10-digit Indian mobile starting with 6-9, address min 8 chars, quantity 1-20, unavailable item rejection). Wrote 8 comprehensive unit tests in `orders/tests.py` and `menu/tests.py`.
* **Files Created / Modified:**
  - `vmas/backend/menu/serializers.py`
  - `vmas/backend/menu/views.py`
  - `vmas/backend/menu/urls.py`
  - `vmas/backend/orders/serializers.py`
  - `vmas/backend/orders/views.py`
  - `vmas/backend/orders/urls.py`
  - `vmas/backend/config/urls.py`
  - `vmas/backend/orders/tests.py`
  - `vmas/backend/menu/tests.py`
* **Run Commands:**
  ```cmd
  python manage.py test
  python manage.py runserver 127.0.0.1:8000
  ```

---

## Step 4: Frontend Setup (React, Vite, Tailwind CSS v4 & Client Routing)
* **Date:** 2026-10-17
* **Summary:** Scaffolded client in `vmas/frontend` using Vite + React 19. Integrated `@tailwindcss/vite` (Tailwind CSS v4) with custom branding (Banana-leaf green `#14452F`, Turmeric gold `#F2B705`, off-white `#FBFBFA`). Added Google Font `Bricolage Grotesque`. Implemented `CartContext.jsx` with `localStorage` persistence, `ThemeContext.jsx` for persistent dark mode toggling, `api/client.js` fetch wrapper, and initial components (`Navbar`, `MenuCard`, `CartItem`, `Footer`, `StatusSteps`). Set up 5 client routes with `react-router-dom`.
* **Files Created / Modified:**
  - `vmas/frontend/package.json`
  - `vmas/frontend/vite.config.js`
  - `vmas/frontend/index.html`
  - `vmas/frontend/src/index.css`
  - `vmas/frontend/src/App.jsx`
  - `vmas/frontend/src/api/client.js`
  - `vmas/frontend/src/context/CartContext.jsx`
  - `vmas/frontend/src/context/ThemeContext.jsx`
  - `vmas/frontend/src/components/Navbar.jsx`
  - `vmas/frontend/src/components/MenuCard.jsx`
  - `vmas/frontend/src/components/CartItem.jsx`
  - `vmas/frontend/src/components/Footer.jsx`
  - `vmas/frontend/src/components/StatusSteps.jsx`
  - `vmas/frontend/src/pages/Home.jsx`
  - `vmas/frontend/src/pages/Menu.jsx`
  - `vmas/frontend/src/pages/Cart.jsx`
  - `vmas/frontend/src/pages/Checkout.jsx`
  - `vmas/frontend/src/pages/TrackOrder.jsx`
  - `vmas/frontend/.env.example`
  - `vmas/frontend/.gitignore`
* **Run Commands:**
  ```cmd
  cd vmas/frontend
  npm install
  npm run build
  npm run dev
  ```

---

## Step 5: Full Pages Implementation & End-to-End API Integration
* **Date:** 2026-10-17
* **Summary:** Connected all frontend pages to live Django API endpoints. `Home` displays hero banner, "Order now" CTA, live popular packs, and 3-step "How it works" guide. `Menu` fetches `/api/menu/` with loading skeleton, error retry, search bar, and interactive Add / + / - stepper on `MenuCard`. `Cart` provides line-item modifiers, total breakdown, and empty-state "Menu-ku po" button. `Checkout` features customer inputs, frontend validations, field-wise backend error rendering, atomic order creation, and cart reset. `TrackOrder` provides live timeline, phone verification, and 15-second automatic refresh. Successfully executed end-to-end full order test.
* **Files Created / Modified:**
  - `vmas/frontend/src/pages/Home.jsx`
  - `vmas/frontend/src/pages/Menu.jsx`
  - `vmas/frontend/src/pages/Cart.jsx`
  - `vmas/frontend/src/pages/Checkout.jsx`
  - `vmas/frontend/src/pages/TrackOrder.jsx`
  - `vmas/frontend/src/components/MenuCard.jsx`
  - `vmas/backend/config/settings.py`
  - `vmas/backend/menu/management/commands/seed_menu.py`
* **Run Commands:**
  ```cmd
  python manage.py runserver 127.0.0.1:8000
  npm run dev
  ```

---

## Step 6: Django Admin Polish, Bulk Actions, Toasts, 404 Page & README
* **Date:** 2026-10-18
* **Summary:** Enhanced Django Admin with order bulk actions ("Mark as Preparing", "Mark as Out for delivery", "Mark as Delivered"), search by customer name, phone, and ID, filters by status, payment method, and date hierarchy. Configured `MenuItemAdmin` with URL-only image fieldset (direct uploads disabled) and inline `is_available` toggles. Built frontend `NotFound.jsx` (404 page), interactive toast notification system (`ToastContext.jsx`) for Add to Cart and Order Placed events, dynamic page titles (`useDocumentTitle` hook), and high-contrast `:focus-visible` accessibility styles. Authored comprehensive root `README.md`.
* **Files Created / Modified:**
  - `vmas/backend/orders/admin.py`
  - `vmas/backend/menu/admin.py`
  - `vmas/frontend/src/context/ToastContext.jsx`
  - `vmas/frontend/src/hooks/useDocumentTitle.js`
  - `vmas/frontend/src/pages/NotFound.jsx`
  - `vmas/frontend/src/App.jsx`
  - `vmas/frontend/src/components/MenuCard.jsx`
  - `vmas/frontend/src/pages/Checkout.jsx`
  - `vmas/frontend/src/pages/Home.jsx`
  - `vmas/frontend/src/pages/Menu.jsx`
  - `vmas/frontend/src/pages/Cart.jsx`
  - `vmas/frontend/src/pages/TrackOrder.jsx`
  - `vmas/frontend/src/index.css`
  - `README.md`
* **Run Commands:**
  ```cmd
  python manage.py check
  npm run build
  ```

---

## Step 7: Deployment Preparation, Comprehensive PDF Generator & GitHub Push
* **Date:** 2026-10-18
* **Summary:** Integrated `whitenoise` for serving static assets in production with `STATIC_ROOT` and `CompressedManifestStaticFilesStorage`. Configured environment variables for production `DEBUG=False`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, and `CSRF_TRUSTED_ORIGINS`. Added Vercel (`vercel.json`) and Netlify (`public/_redirects`) SPA routing configuration. Created `vmas/docs/CHANGELOG.md` and authored comprehensive `vmas/docs/generate_pdf.py` script producing `vmas/docs/VMAS_Documentation.pdf` with cover page, project overview, tech stack, folder structure, database schema, API documentation, deployment checklists, and changelog. Prepared monorepo Git structure on `main` branch ready for GitHub push to `dharuntech275/vmas`.
* **Files Created / Modified:**
  - `vmas/backend/requirements.txt`
  - `vmas/backend/config/settings.py`
  - `vmas/backend/.env.example`
  - `vmas/frontend/vercel.json`
  - `vmas/frontend/public/_redirects`
  - `vmas/frontend/.env.example`
  - `vmas/docs/CHANGELOG.md`
  - `vmas/docs/generate_pdf.py`
  - `vmas/docs/VMAS_Documentation.pdf`
  - `vmas/.gitignore`
  - `vmas/README.md`
* **Run Commands:**
  ```cmd
  python vmas/docs/generate_pdf.py
  git init
  git remote add origin https://github.com/dharuntech275/vmas.git
  ```

---

## Step 8: Menu Asset Customization - Authentic Chapathi Image Integration
* **Date:** 2026-10-18
* **Summary:** Replaced placeholder Chapathi menu item image with authentic freshly-made golden wheat chapathis stack image uploaded by client. Saved high-resolution asset to `frontend/public/images/chapathi.jpg` and `frontend/src/assets/chapathi.jpg`. Updated database record and `seed_menu.py` command with relative asset path `/images/chapathi.jpg`. Updated `MenuItemAdminForm` in `backend/menu/admin.py` and `MenuItemSerializer` in `backend/menu/serializers.py` to seamlessly accept local asset paths alongside external CDN URLs. Verified HTTP 200 asset delivery on Vite frontend dev server and live DRF `/api/menu/` endpoint.
* **Files Created / Modified:**
  - `vmas/frontend/public/images/chapathi.jpg`
  - `vmas/frontend/src/assets/chapathi.jpg`
  - `vmas/backend/menu/management/commands/seed_menu.py`
  - `vmas/backend/menu/admin.py`
  - `vmas/backend/menu/serializers.py`
  - `vmas/docs/CHANGELOG.md`
  - `vmas/docs/VMAS_Documentation.pdf`
* **Run Commands:**
  ```cmd
  python backend/manage.py seed_menu
  python docs/generate_pdf.py
  ```

---

## Step 9: Authentic Menu Assets for Poori, Plain Naan, and Wheat Parotta
* **Date:** 2026-10-18
* **Summary:** Integrated authentic client-provided food imagery for Poori (puffed golden pooris on wooden plate), Plain Naan (tandoor-baked herb-buttered naans), and Wheat Parotta (golden spiral layered wheat parottas). Placed high-resolution images in `frontend/public/images/` (`poori.jpg`, `plain_naan.jpg`, `wheat_parotta.jpg`) and mirrored in `frontend/src/assets/`. Updated `seed_menu.py` with relative asset paths and executed database synchronization. Verified all four food pack items return HTTP 200 on port 3000 and live DRF `/api/menu/` endpoint.
* **Files Created / Modified:**
  - `vmas/frontend/public/images/poori.jpg`
  - `vmas/frontend/public/images/plain_naan.jpg`
  - `vmas/frontend/public/images/wheat_parotta.jpg`
  - `vmas/frontend/src/assets/poori.jpg`
  - `vmas/frontend/src/assets/plain_naan.jpg`
  - `vmas/frontend/src/assets/wheat_parotta.jpg`
  - `vmas/backend/menu/management/commands/seed_menu.py`
  - `vmas/docs/CHANGELOG.md`
  - `vmas/docs/VMAS_Documentation.pdf`
* **Run Commands:**
  ```cmd
  python backend/manage.py seed_menu
  python docs/generate_pdf.py
  git push origin main
  ```

---

## Step 10: Menu Optimization - Removed Phulka and Butter Naan
* **Date:** 2026-10-18
* **Summary:** Streamlined the menu catalog by removing Phulka and Butter Naan, standardizing the offerings around the 4 staple bread packs (Chapathi, Wheat Parotta, Plain Naan, and Poori). Updated `seed_menu.py` management command and removed records and associated test references from the database. Updated promotional copy in `Home.jsx` and project documentation in `generate_pdf.py`. Verified that `GET /api/menu/` returns only the 4 active items and that all 8 automated unit tests pass.
* **Files Created / Modified:**
  - `vmas/backend/menu/management/commands/seed_menu.py`
  - `vmas/frontend/src/pages/Home.jsx`
  - `vmas/docs/generate_pdf.py`
  - `vmas/docs/CHANGELOG.md`
  - `vmas/docs/VMAS_Documentation.pdf`
* **Run Commands:**
  ```cmd
  python backend/manage.py test
  python docs/generate_pdf.py
  git push origin main
  ```

---

## Step 11: Menu Expansion - Added Bajra Chapathi and Chola Poori
* **Date:** 2026-10-20
* **Summary:** Expanded the VMAS menu offerings with two new items: Bajra Chapathi (Pack of 5, ₹60.00, wholesome pearl millet flatbread) and Chola Poori (Pack of 3, ₹75.00, large fluffy golden bhatura-style pooris). Placed high-resolution studio imagery into `frontend/public/images/` (`bajra_chapathi.jpg`, `chola_poori.jpg`) and mirrored to `frontend/src/assets/`. Updated `seed_menu.py` management command and synchronized database records. Verified HTTP 200 image serving on port 3000 and live DRF `/api/menu/` payload with 6 total menu items. Regenerated PDF documentation.
* **Files Created / Modified:**
  - `vmas/frontend/public/images/bajra_chapathi.jpg`
  - `vmas/frontend/public/images/chola_poori.jpg`
  - `vmas/frontend/src/assets/bajra_chapathi.jpg`
  - `vmas/frontend/src/assets/chola_poori.jpg`
  - `vmas/backend/menu/management/commands/seed_menu.py`
  - `vmas/docs/CHANGELOG.md`
  - `vmas/docs/VMAS_Documentation.pdf`
* **Run Commands:**
  ```cmd
  python backend/manage.py seed_menu
  python docs/generate_pdf.py
  git push origin main
  ```

---

## Step 12: Menu Expansion - Added Authentic Maida Parotta
* **Date:** 2026-10-20
* **Summary:** Added traditional South Indian Maida Parotta to the VMAS menu catalog (Pack of 4, ₹50.00, crispy spiral layered golden parotta). Placed high-resolution studio imagery into `frontend/public/images/maida_parotta.jpg` and mirrored to `frontend/src/assets/`. Updated `seed_menu.py` management command and synchronized database records. Verified HTTP 200 image serving on port 3000 and live DRF `/api/menu/` payload with 7 total menu items. Regenerated PDF documentation.
* **Files Created / Modified:**
  - `vmas/frontend/public/images/maida_parotta.jpg`
  - `vmas/frontend/src/assets/maida_parotta.jpg`
  - `vmas/backend/menu/management/commands/seed_menu.py`
  - `vmas/docs/CHANGELOG.md`
  - `vmas/docs/VMAS_Documentation.pdf`
* **Run Commands:**
  ```cmd
  python backend/manage.py seed_menu
  python docs/generate_pdf.py
  git push origin main
  ```

---

## Step 13: Specialty Millet & Herbal Expansion - Added Mudakathan Keerai, Methi, and Ragi Chapathi
* **Date:** 2026-10-20
* **Summary:** Expanded the traditional specialty bread line-up with three nutritious varieties:
  1. **Mudakathan Keerai Chapathi (Pack of 5, ₹65.00)** — herbal chapathis infused with medicinal balloon vine greens for joint vitality.
  2. **Methi Chapathi (Pack of 5, ₹60.00)** — flavorful soft rotis blended with fresh aromatic fenugreek leaves.
  3. **Ragi Chapathi (Pack of 5, ₹60.00)** — wholesome finger millet flatbreads rich in natural calcium and fiber.
  Placed high-resolution studio imagery into `frontend/public/images/` and mirrored to `frontend/src/assets/`. Updated `seed_menu.py` management command and synchronized database records. Verified HTTP 200 image delivery on port 3000 and live DRF `/api/menu/` payload with 10 total menu items. Regenerated PDF documentation.
* **Files Created / Modified:**
  - `vmas/frontend/public/images/mudakathan_keerai_chapathi.jpg`
  - `vmas/frontend/public/images/methi_chapathi.jpg`
  - `vmas/frontend/public/images/ragi_chapathi.jpg`
  - `vmas/frontend/src/assets/mudakathan_keerai_chapathi.jpg`
  - `vmas/frontend/src/assets/methi_chapathi.jpg`
  - `vmas/frontend/src/assets/ragi_chapathi.jpg`
  - `vmas/backend/menu/management/commands/seed_menu.py`
  - `vmas/docs/CHANGELOG.md`
  - `vmas/docs/VMAS_Documentation.pdf`
* **Run Commands:**
  ```cmd
  python backend/manage.py seed_menu
  python docs/generate_pdf.py
  git push origin main
  ```

---

## Step 14: Menu Quantity Restructuring - Updated All Pack Sizes
* **Date:** 2026-10-21
* **Summary:** Updated the pack quantities for all 10 food items to match revised client portion sizes:
  - Bajra Chapathi: **Pack of 10** (was 5)
  - Chola Poori: **Pack of 12** (was 3)
  - Maida Parotta: **Pack of 10** (was 4)
  - Mudakathan Keerai Chapathi: **Pack of 10** (was 5)
  - Plain Naan: **Pack of 10** (was 4)
  - Chapathi: **Pack of 10** (was 5)
  - Poori: **Pack of 15** (was 6)
  - Methi Chapathi: **Pack of 10** (was 5)
  - Ragi Chapathi: **Pack of 10** (was 5)
  - Wheat Parotta: **Pack of 10** (was 4)
  Updated `seed_menu.py` management command and synchronized database records. Verified all 10 items reflect new portions across `/api/menu/` and frontend cards. Regenerated PDF documentation.
* **Files Created / Modified:**
  - `vmas/backend/menu/management/commands/seed_menu.py`
  - `vmas/docs/CHANGELOG.md`
  - `vmas/docs/VMAS_Documentation.pdf`
* **Run Commands:**
  ```cmd
  python backend/manage.py seed_menu
  python docs/generate_pdf.py
  git push origin main
  ```

