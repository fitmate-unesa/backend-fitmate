# 🏃 Backend FitMate

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

**Backend API untuk aplikasi mobile FitMate - Solusi kesehatan dan kebugaran berbasis AI**

</div>

---

## 📋 Daftar Isi

- [Overview](#-overview)
- [Fitur Utama](#-fitur-utama)
- [Teknologi](#-teknologi-yang-digunakan)
- [Arsitektur](#-arsitektur)
- [Struktur Repositori](#-struktur-repositori)
- [Instalasi](#-instalasi)
- [Konfigurasi](#-konfigurasi-environment)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Overview

Backend FitMate adalah RESTful API yang dibangun untuk mendukung aplikasi mobile FitMate. API ini menyediakan layanan komprehensif untuk:

- **Autentikasi pengguna** dengan Supabase Auth
- **Manajemen data makanan** termasuk pencatatan dan estimasi nutrisi berbasis AI
- **Pelacakan olahraga** (lari, olahraga umum, dan gym)
- **Rekomendasi fitness berbasis AI** menggunakan Google Generative AI (Gemini)
- **Integrasi YouTube** untuk konten video kebugaran
- **Sistem pembayaran premium** menggunakan Midtrans

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| 🔐 **Authentication** | Register, login, dan update profil pengguna |
| 🍎 **Food Tracking** | Catat dan lacak konsumsi makanan harian |
| 🤖 **AI Nutrition** | Estimasi nutrisi otomatis menggunakan Gemini AI |
| 🏃 **Run Tracking** | Simpan data lari termasuk rute, jarak, dan kalori |
| 🏋️ **Sports Planning** | Generate rencana olahraga personal dengan AI |
| 📍 **Gym Finder** | Temukan gym terdekat dari lokasi pengguna |
| 📺 **YouTube Integration** | Cari video workout dari YouTube |
| 💳 **Premium Subscription** | Sistem pembayaran dengan Midtrans |
| 💬 **AI Chat** | Konsultasi kebugaran dengan AI assistant |

---

## 🛠 Teknologi yang Digunakan

### Core
| Teknologi | Deskripsi |
|-----------|-----------|
| **Node.js** | Runtime JavaScript untuk server-side |
| **Express.js v5** | Framework web untuk membangun RESTful API |

### Database & Auth
| Teknologi | Deskripsi |
|-----------|-----------|
| **Supabase** | Backend-as-a-Service untuk PostgreSQL dan autentikasi |
| **Row Level Security** | Keamanan data berbasis user |

### AI & External Services
| Teknologi | Deskripsi |
|-----------|-----------|
| **Google Generative AI** | Gemini model untuk fitur AI (nutrisi & rekomendasi) |
| **Midtrans** | Payment gateway untuk subscription premium |
| **Axios** | HTTP client untuk integrasi API eksternal |

### Middleware & Utilities
| Teknologi | Deskripsi |
|-----------|-----------|
| **CORS** | Cross-Origin Resource Sharing |
| **Morgan** | HTTP request logging |
| **Multer** | File upload handling |
| **Dotenv** | Environment variable management |

### Deployment
| Teknologi | Deskripsi |
|-----------|-----------|
| **Vercel** | Serverless deployment platform |

---

## 🏗 Arsitektur

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Mobile App    │────▶│  Express.js     │────▶│   Supabase      │
│   (Flutter)     │     │  Backend API    │     │   (PostgreSQL)  │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                   ┌─────────────┼─────────────┐
                   │             │             │
                   ▼             ▼             ▼
            ┌──────────┐  ┌──────────┐  ┌──────────┐
            │ Gemini   │  │ Midtrans │  │ YouTube  │
            │ AI       │  │ Payment  │  │ API      │
            └──────────┘  └──────────┘  └──────────┘
```

---

## 📁 Struktur Repositori

```
backendfitmate/
├── 📄 .env.example              # Template environment variables
├── 📄 .gitignore                # File yang diabaikan Git
├── 📄 package.json              # Konfigurasi npm dan dependencies
├── 📄 package-lock.json         # Lock file dependencies
├── 📄 vercel.json               # Konfigurasi deployment Vercel
├── 📄 README.md                 # Dokumentasi (file ini)
│
├── 📂 src/                      # Source code utama
│   ├── 📄 index.js              # Entry point dan setup Express
│   │
│   ├── 📂 config/               # Konfigurasi layanan eksternal
│   │   ├── 📄 gemini.js         # Setup Google Generative AI
│   │   ├── 📄 supabase.js       # Setup Supabase client
│   │   └── 📄 midtrans.js       # Setup Midtrans Snap
│   │
│   ├── 📂 controllers/          # Logic bisnis untuk setiap fitur
│   │   ├── 📄 aiController.js           # Handler AI chat
│   │   ├── 📄 authController.js         # Handler autentikasi
│   │   ├── 📄 foodController.js         # Handler makanan & nutrisi
│   │   ├── 📄 gymController.js          # Handler pencarian gym
│   │   ├── 📄 paymentController.js      # Handler pembayaran
│   │   ├── 📄 runController.js          # Handler tracking lari
│   │   ├── 📄 sportsController.js       # Handler rencana olahraga
│   │   ├── 📄 subscriptionController.js # Handler langganan
│   │   └── 📄 youtubeController.js      # Handler video YouTube
│   │
│   ├── 📂 middleware/           # Express middleware
│   │   └── 📄 auth.js           # JWT authentication middleware
│   │
│   └── 📂 routes/               # Definisi API routes
│       ├── 📄 ai.js             # Routes /api/ai/*
│       ├── 📄 auth.js           # Routes /api/auth/*
│       ├── 📄 food.js           # Routes /api/food/*
│       ├── 📄 gym.js            # Routes /api/gym/*
│       ├── 📄 payment.js        # Routes /api/payment/*
│       ├── 📄 run.js            # Routes /api/run/*
│       ├── 📄 sports.js         # Routes /api/sports/*
│       ├── 📄 subscription.js   # Routes /api/subscription/*
│       └── 📄 youtube.js        # Routes /api/youtube/*
│
└── 📂 supabase/                 # Database
    └── 📄 schema.sql            # Skema database PostgreSQL
```

---

## 🚀 Instalasi

### Persyaratan Sistem

- **Node.js** v14.0.0 atau lebih tinggi
- **npm** v6.0.0 atau lebih tinggi
- **Akun Supabase** untuk database dan autentikasi
- **API Key Google Generative AI** untuk fitur AI
- **Akun Midtrans** untuk payment gateway (opsional)

### Langkah Instalasi

#### 1. Clone Repositori

```bash
git clone https://github.com/fitmate-unesa/backend-fitmate.git
cd backendfitmate
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Setup Environment Variables

Salin file `.env.example` ke `.env`:

```bash
cp .env.example .env
```

Edit file `.env` dengan konfigurasi Anda (lihat bagian [Konfigurasi Environment](#-konfigurasi-environment)).

#### 4. Setup Database

Jalankan skema database di Supabase:

1. Buka [Supabase Dashboard](https://app.supabase.com)
2. Pilih project Anda
3. Buka **SQL Editor**
4. Copy-paste isi file `supabase/schema.sql`
5. Jalankan query

#### 5. Jalankan Server

**Mode Development** (dengan auto-reload):
```bash
npm run dev
```

**Mode Production**:
```bash
npm start
```

Server akan berjalan di `http://localhost:3000`.

#### 6. Verifikasi Instalasi

```bash
curl http://localhost:3000/
```

Response yang diharapkan:
```
FitMate Backend is running
```

---

## ⚙ Konfigurasi Environment

Buat file `.env` di root direktori dengan variabel berikut:

```env
# Server
PORT=3000

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# JWT (optional, uses Supabase JWT)
JWT_SECRET=your-jwt-secret

# Google Generative AI
GOOGLE_AI_API_KEY=your-gemini-api-key

# Midtrans (for payment)
MIDTRANS_SERVER_KEY=your-midtrans-server-key
MIDTRANS_CLIENT_KEY=your-midtrans-client-key
```

### Mendapatkan API Keys

| Service | Cara Mendapatkan |
|---------|------------------|
| **Supabase** | [Dashboard Supabase](https://app.supabase.com) → Settings → API |
| **Google AI** | [Google AI Studio](https://aistudio.google.com/app/apikey) |
| **Midtrans** | [Dashboard Midtrans](https://dashboard.midtrans.com) → Settings → Access Keys |

---

## 📚 API Endpoints

### Base URL
- **Development**: `http://localhost:3000`
- **Production**: `https://your-domain.vercel.app`

### Authentication Header
Semua endpoint yang membutuhkan autentikasi harus menyertakan header:
```
Authorization: Bearer <access_token>
```

---

### 🔐 Auth (`/api/auth`)

#### Register Pengguna Baru

```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "full_name": "John Doe"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com"
    },
    "session": { ... }
  }
}
```

#### Login

```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "data": {
    "user": { ... },
    "session": {
      "access_token": "your-jwt-token",
      "refresh_token": "refresh-token"
    }
  }
}
```

#### Update Profil

```http
PUT /api/auth/profile
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "password": "newpassword" // optional
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "data": { ... }
}
```

---

### 🍎 Food (`/api/food`)

> ⚠️ Semua endpoint membutuhkan autentikasi

#### Simpan Log Makanan

```http
POST /api/food/log
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Nasi Goreng",
  "calories": 350,
  "protein": 12,
  "carbs": 45,
  "fat": 15,
  "fiber": 2,
  "source": "MANUAL",
  "confidence": null,
  "image_url": null
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "name": "Nasi Goreng",
  "calories": 350,
  ...
}
```

#### Ambil Riwayat Makanan

```http
GET /api/food/history
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": "uuid",
    "name": "Nasi Goreng",
    "calories": 350,
    "created_at": "2024-01-01T12:00:00Z"
  },
  ...
]
```

#### Estimasi Nutrisi dengan AI

```http
POST /api/food/estimate
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Tempe Goreng",
  "grams": 100
}
```

**Response (200):**
```json
{
  "calories": 193,
  "protein_g": 19,
  "carbs_g": 7.6,
  "fat_g": 11,
  "fiber_g": 1.4,
  "summary": "Porsi 100g tempe goreng mengandung protein tinggi dan cocok untuk diet bulking."
}
```

---

### 🏃 Run (`/api/run`)

> ⚠️ Semua endpoint membutuhkan autentikasi

#### Simpan Data Lari

```http
POST /api/run
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "duration_seconds": 1800,
  "distance_meters": 5000,
  "calories_burned": 350,
  "pace_seconds_per_km": 360,
  "route_path": [
    {"lat": -7.2575, "lng": 112.7521},
    {"lat": -7.2580, "lng": 112.7530}
  ],
  "image_url": null
}
```

#### Ambil Riwayat Lari

```http
GET /api/run
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": "uuid",
    "duration_seconds": 1800,
    "distance_meters": 5000,
    "calories_burned": 350,
    "created_at": "2024-01-01T06:00:00Z"
  }
]
```

---

### 🏋️ Sports (`/api/sports`)

> ⚠️ Semua endpoint membutuhkan autentikasi

#### Generate Rencana Olahraga dengan AI

```http
POST /api/sports/generate
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "goal": "bulking",
  "height": 170,
  "weight": 65
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "goal": "bulking",
  "plan_data": {
    "weekly_schedule": [...],
    "exercises": [...],
    "recommendations": "..."
  }
}
```

#### Ambil Riwayat Rencana

```http
GET /api/sports/history
Authorization: Bearer <token>
```

---

### 📍 Gym (`/api/gym`)

> ⚠️ Membutuhkan autentikasi

#### Cari Gym Terdekat

```http
POST /api/gym/nearby
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "latitude": -7.2575,
  "longitude": 112.7521,
  "radius": 5000
}
```

---

### 📺 YouTube (`/api/youtube`)

> ⚠️ Membutuhkan autentikasi

#### Cari Video Shorts

```http
POST /api/youtube/shorts
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "query": "workout pemanasan",
  "maxResults": 10
}
```

---

### 💬 AI (`/api/ai`)

> ⚠️ Membutuhkan autentikasi

#### Chat dengan AI

```http
POST /api/ai/chat
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "message": "Bagaimana cara menurunkan berat badan dengan sehat?"
}
```

**Response (200):**
```json
{
  "response": "Untuk menurunkan berat badan dengan sehat, Anda perlu..."
}
```

---

### 💳 Payment (`/api/payment`)

#### Ambil Daftar Harga (Public)

```http
GET /api/payment/pricing
```

**Response (200):**
```json
{
  "plans": [
    {
      "id": "basic",
      "name": "Basic (1 Bulan)",
      "duration_months": 1,
      "price": 15500,
      "price_formatted": "Rp 15.500"
    },
    {
      "id": "standard",
      "name": "Standard (3 Bulan)",
      "duration_months": 3,
      "price": 39000,
      "price_formatted": "Rp 39.000"
    },
    {
      "id": "premium",
      "name": "Premium (6 Bulan)",
      "duration_months": 6,
      "price": 62500,
      "price_formatted": "Rp 62.500"
    },
    {
      "id": "ultimate",
      "name": "Ultimate (12 Bulan)",
      "duration_months": 12,
      "price": 94000,
      "price_formatted": "Rp 94.000"
    }
  ]
}
```

#### Buat Transaksi Pembayaran

```http
POST /api/payment/create
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "plan_type": "premium"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "snap-token",
  "redirect_url": "https://app.midtrans.com/snap/v2/vtweb/...",
  "order_id": "FITMATE-1234567890-uuid"
}
```

#### Webhook Notifikasi Midtrans

```http
POST /api/payment/notification
```

> ⚠️ Endpoint ini dipanggil oleh Midtrans, bukan client

---

### 📊 Subscription (`/api/subscription`)

> ⚠️ Membutuhkan autentikasi

#### Cek Status Langganan

```http
GET /api/subscription/status
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "is_premium": true,
  "subscription": {
    "plan_type": "premium",
    "status": "active",
    "started_at": "2024-01-01T00:00:00Z",
    "expires_at": "2024-07-01T00:00:00Z"
  }
}
```

#### Riwayat Transaksi

```http
GET /api/subscription/transactions
Authorization: Bearer <token>
```

---

## 🗄 Database Schema

### Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│  auth.users  │───┬───│   profiles   │       │  food_logs   │
│  (Supabase)  │   │   └──────────────┘       └──────┬───────┘
└──────────────┘   │                                 │
                   │   ┌──────────────┐              │
                   ├───│   run_logs   │──────────────┘
                   │   └──────────────┘
                   │
                   │   ┌──────────────┐       ┌──────────────┐
                   ├───│ sports_plans │       │ transactions │
                   │   └──────────────┘       └──────┬───────┘
                   │                                 │
                   │   ┌──────────────┐              │
                   └───│subscriptions │──────────────┘
                       └──────────────┘
```

### Tables

#### `profiles`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK, FK) | References auth.users |
| email | text | Email pengguna |
| full_name | text | Nama lengkap |
| height | numeric | Tinggi badan (cm) |
| weight | numeric | Berat badan (kg) |
| created_at | timestamp | Waktu dibuat |

#### `food_logs`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Primary key |
| user_id | uuid (FK) | References profiles |
| name | text | Nama makanan |
| calories | numeric | Kalori (kcal) |
| protein | numeric | Protein (g) |
| carbs | numeric | Karbohidrat (g) |
| fat | numeric | Lemak (g) |
| fiber | numeric | Serat (g) |
| source | text | SCAN / MANUAL |
| confidence | numeric | Confidence AI |
| image_url | text | URL gambar |
| created_at | timestamp | Waktu dibuat |

#### `run_logs`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Primary key |
| user_id | uuid (FK) | References profiles |
| duration_seconds | integer | Durasi (detik) |
| distance_meters | numeric | Jarak (meter) |
| calories_burned | numeric | Kalori terbakar |
| pace_seconds_per_km | numeric | Pace (s/km) |
| route_path | jsonb | Array koordinat |
| image_url | text | URL gambar |
| created_at | timestamp | Waktu dibuat |

#### `sports_plans`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Primary key |
| user_id | uuid (FK) | References profiles |
| goal | text | bulking / cutting |
| current_height | numeric | Tinggi saat itu |
| current_weight | numeric | Berat saat itu |
| plan_data | jsonb | Data rencana |
| created_at | timestamp | Waktu dibuat |

### Row Level Security (RLS)

Semua tabel menggunakan RLS dengan policy:
- **SELECT**: User hanya bisa melihat datanya sendiri
- **INSERT**: User hanya bisa insert data miliknya
- **UPDATE**: User hanya bisa update datanya sendiri

---

## 🚀 Deployment

### Deploy ke Vercel

#### 1. Install Vercel CLI

```bash
npm install -g vercel
```

#### 2. Login ke Vercel

```bash
vercel login
```

#### 3. Deploy

```bash
vercel
```

#### 4. Set Environment Variables

Di Vercel Dashboard:
1. Buka project → Settings → Environment Variables
2. Tambahkan semua variabel dari `.env`

### Konfigurasi `vercel.json`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/index.js"
    }
  ]
}
```

---

## ❗ Troubleshooting

### Error: Cannot connect to Supabase

**Penyebab**: Konfigurasi Supabase salah
**Solusi**:
1. Pastikan `SUPABASE_URL` dan `SUPABASE_KEY` benar
2. Cek apakah project Supabase aktif
3. Pastikan tidak ada typo

### Error: Gemini API rate limit

**Penyebab**: Terlalu banyak request ke Gemini AI
**Solusi**:
1. Tunggu beberapa menit
2. Upgrade ke plan berbayar
3. Implementasi caching

### Error: CORS blocked

**Penyebab**: Request dari origin yang tidak diizinkan
**Solusi**:
1. Tambahkan origin ke CORS config di `index.js`
2. Pastikan header request sesuai

### Error: 401 Unauthorized

**Penyebab**: Token tidak valid atau expired
**Solusi**:
1. Login ulang untuk mendapatkan token baru
2. Pastikan header Authorization format: `Bearer <token>`

---

## 📝 Scripts

| Script | Deskripsi |
|--------|-----------|
| `npm start` | Jalankan server production |
| `npm run dev` | Jalankan server dengan auto-reload (nodemon) |
| `npm test` | Jalankan test (belum diimplementasi) |

---

## 👥 Tim Pengembang

Backend FitMate dikembangkan oleh tim FitMate UNESA.

---

## 📄 Lisensi

ISC License

---

<div align="center">

**Made with ❤️ for FitMate**

</div>
