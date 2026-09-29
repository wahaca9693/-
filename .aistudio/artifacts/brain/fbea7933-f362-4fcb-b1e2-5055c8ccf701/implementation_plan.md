# M.N.R – مركز المنار للموبايل | Flagship E-Commerce Platform

A production-grade, luxury e-commerce platform and operational back-office for M.N.R (مركز المنار للموبايل) built for the Iraqi electronics market, featuring end-to-end shopping cart flows, Iraqi governorate delivery validation (5,000 IQD flat fee), real-time order tracking, and a PIN-secured comprehensive Admin Dashboard.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following decisions were clarified and confirmed in Phase 1:

- **Confirmed Decision 1 (Brand Identity)**: Official name is **M.N.R – مركز المنار للموبايل** matching the official crown-and-wings golden emblem in the brand identity assets.
- **Confirmed Decision 2 (Admin Security)**: The Admin Dashboard is protected by a secure 4-digit PIN code dialog (default PIN `1234`, changeable inside Admin Settings) ensuring customer and order privacy.
- **Delivery Model**: Fixed shipping rate of **5,000 د.ع** across all 18 Iraqi governorates (Baghdad, Karbala, Najaf, Basra, Erbil, Sulaymaniyah, Duhok, Kirkuk, Nineveh, Babil, Wasit, Diyala, Anbar, Salah al-Din, Dhi Qar, Maysan, Muthanna, Qadisiyyah).
- **Currency & Localization**: Exclusively Iraqi Dinar (**د.ع / IQD**) with Arabic RTL typography and strict Iraqi mobile number validation (`07XXXXXXXXX`).

---

## 1. Overview & Core Concept

M.N.R (مركز المنار للموبايل) is a premier technology and smartphone retailer in Iraq specializing in original smartphones (Apple iPhone, Samsung Galaxy), audio solutions (AirPods, Sony), GaN fast chargers (Anker, Apple), power banks, cases, screen protection, smartwatches, and accessories.

### Key Value & Objectives
1. **True Commercial Storefront**: Real stateful shopping cart, quantity controls, dynamic price computation, and single-click quick checkout.
2. **Iraqi Logistics Engine**: Full 18-governorate dropdown selector with district, neighborhood, detailed address, nearest landmark (أقرب نقطة دالة), and Iraqi phone number validation.
3. **Live Order Lifecycle & Tracking**: Customer order confirmation with unique sequential tracking numbers (`MNR-YYYYMMDD-XXX`) and an interactive 6-stage delivery timeline.
4. **Complete Admin Command Center**: Real-time order monitoring with audio chime alerts, order status manipulation (جديد → قيد المراجعة → تم التأكيد → قيد التجهيز → خرج للتوصيل → تم التسليم / ملغي), live stock depletion (auto "نفذ المخزون" at 0), product CRUD with image & discount management, customers directory, and revenue analytics charts.

---

## 2. User Experience & Visual Design

### Visual Identity & Theme
- **Color Discipline (60-30-10)**:
  - 60% Canvas: Deep luxury obsidian black (`#080808` and `#131313`).
  - 30% Structural: Elevated slate containers (`#1A1A1A`, `#222222`), hairline metallic borders (`#B8860B` at 25% opacity), and soft atmospheric gold blur halos.
  - 10% Gold Accent: Metallic Gold (`#D4AF37`) and Brilliant Gold (`#FFD700`) applied strictly to primary CTAs, active checkout states, star ratings, and prices.
- **Typography & RTL Hierarchy**:
  - `IBM Plex Sans Arabic` and `Cairo` with proportional font weights, bold headlines, and tabular numerals (`font-mono tabular-nums`) for Iraqi Dinar prices and tracking codes.
- **Atmospheric Elements**:
  - Golden crown official SVG vector logo + high-resolution official brand assets.
  - Micro-interactions: Gold glow on hover, animated cart counter badge (`🛒 3`), smooth slide-over cart drawer, and celebratory order submission modal.

### Key User Flows
1. **Visitor Journey**:
   - Splash Loading Screen with animated metallic gold M.N.R insignia and crown reveal.
   - Luxury Hero Section with primary campaign banner, quick category navigation chips (الهواتف, السماعات, الشواحن, البطاريات, الكيبلات, الكفرات, الساعات).
   - Real-time instant search and category filter shelf.
   - Product detail modal with storage/color variants, warranty guarantee, and stock status.
2. **Checkout & Order Placement**:
   - Floating cart drawer or full checkout view with item removal, quantity adjustment, and live calculation.
   - Iraqi customer verification form: Name, Phone (`07XXXXXXXXX`), Governorate dropdown, District/City, Neighborhood, Nearest Landmark, Detailed Address, Notes.
   - Order Review summary before final commit showing breakdown: Items total + Fixed 5,000 د.ع delivery = Final Total.
   - Order generation generating unique ID (e.g. `MNR-20260929-001`).
3. **Customer Self-Service Tracking**:
   - Order tracking tab: Lookup by order ID + phone number to inspect real-time timeline stage and courier status.
4. **Admin Dashboard (Protected by 4-digit PIN)**:
   - Live metrics: Total Orders, Revenue (IQD), Pending, In-Delivery, Delivered, Low Stock alerts.
   - Live incoming order alert chime with notification badge.
   - Order action controls: Change status across timeline, view customer phone with direct call / WhatsApp link, print packing slip / invoice.
   - Products Management: Add new product, edit price, adjust stock, toggle availability.
   - Customer CRM: Order count, total spent, governorate breakdown.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Stateful Local + Server-Ready Data Store**
  - *Chosen Approach*: Comprehensive TypeScript state engine backed by `localStorage` persistence with seamless reactivity between storefront orders and admin dispatch screens.
  - *Why*: Instant zero-latency updates without requiring remote cloud setup hurdles, while maintaining strict schema parity (`Order`, `Product`, `Customer`, `Inventory`).
- **Decision 2: Phone Number Validation for Iraq**
  - *Chosen Approach*: Regex enforcement requiring valid Iraqi carrier prefixes (`077`, `078`, `075`, `079`) and exactly 11 digits, with descriptive inline Arabic error feedback.
  - *Why*: Prevents fake orders and guarantees couriers can establish immediate WhatsApp/call contact.
- **Decision 3: Dedicated Admin PIN Security Gate**
  - *Chosen Approach*: PIN entry modal with instant verification, auto-lock on inactivity or logout, and quick toggle between Storefront view and Admin Console.
  - *Why*: Balances seamless local testing with genuine role-based protection.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                   M.N.R E-Commerce Architecture                         │
└────────────────────────────────────────────────────────────────────────┘
                                    │
         ┌──────────────────────────┴──────────────────────────┐
         ▼                                                     ▼
┌───────────────────────────────────┐       ┌───────────────────────────────────┐
│     Customer Storefront (RTL)     │       │    Admin Command Center (PIN)     │
├───────────────────────────────────┤       ├───────────────────────────────────┤
│ • Animated Gold Splash Loader     │       │ • KPI Metrics & Revenue Ledger    │
│ • Official Hero & Brand Showcase  │       │ • Live Incoming Order Chime       │
│ • Category Tabs & Live Search     │       │ • Order Status Pipeline Shift     │
│ • Real Cart & Slide-Over Drawer   │       │ • Product CRUD & Stock Management │
│ • 18-Governorate Checkout Form    │       │ • Low Stock Depletion Alerts      │
│ • Iraqi Phone Regex Validator     │       │ • Customer CRM Directory          │
│ • Pre-submit Order Review Modal   │       │ • Printable Packing Slips         │
│ • Real-time Order Tracking Rail   │       │ • Audio Alert & Security Settings │
└───────────────────────────────────┘       └───────────────────────────────────┘
         │                                                     │
         └──────────────────────────┬──────────────────────────┘
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   Unified Reactive Store (App Context)                 │
├────────────────────────────────────────────────────────────────────────┤
│ • Products Catalog (phones, audio, chargers, batteries, accessories)   │
│ • Shopping Cart Items & Subtotals (5,000 د.ع delivery rule)            │
│ • Orders Collection (ID: MNR-YYYYMMDD-XXX, status, customer, items)   │
│ • Inventory Quantities (auto decrement on checkout, 0 = Out of Stock) │
│ • Wishlist Store & Customer Profiles                                   │
│ • Admin Authentication Session (PIN validation)                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Entity Schemas (TypeScript)
```typescript
interface Order {
  id: string;
  orderNumber: string; // e.g. "MNR-20260929-001"
  customerName: string;
  phone: string;
  governorate: string; // 1 of 18 Iraqi governorates
  city: string;
  district: string;
  address: string;
  nearestLandmark: string;
  notes?: string;
  items: Array<{
    productId: string;
    name: string;
    image: string;
    price: number; // in IQD
    quantity: number;
    brand: string;
  }>;
  subtotal: number;
  deliveryFee: 5000;
  total: number;
  status: 'new' | 'reviewing' | 'confirmed' | 'processing' | 'dispatched' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}
```

---

## 5. Execution Roadmap

1. **Brand Assets & Typography Foundation**: Configure Tailwind with obsidian black & metallic gold tokens, embed official M.N.R insignia and crown vector identity, setup RTL layout and IBM Plex Sans Arabic.
2. **Product Catalog & Inventory Engine**: Seed initial realistic Iraqi flagship inventory across all 8 required categories (iPhone 17 Pro Max, Galaxy S26 Ultra, AirPods Pro 2, Anker 65W GaN, MagSafe batteries, armored cables, smartwatches).
3. **Cart & Iraqi Checkout Flow**: Interactive cart increment/decrement, 5,000 IQD fixed delivery fee calculation, Iraqi phone verification, 18-governorate dropdown selector, nearest landmark requirement, and pre-submit review step.
4. **Order Tracking System**: Search orders by number and phone with the 6-stage dynamic timeline.
5. **PIN-Secured Admin Dashboard**: Audio notification chime, order status timeline switcher, customer analytics, stock management, and new product creation.
6. **Polishing & Verification**: Loading screen animation, empty & error states, responsive testing, and `compile_applet` build validation.
