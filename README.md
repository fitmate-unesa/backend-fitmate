# Backend FitMate

## Overview
Backend FitMate adalah repositori backend untuk aplikasi mobile FitMate, yang dirancang untuk mendukung fitur-fitur kesehatan dan kebugaran. Backend ini menyediakan API untuk autentikasi pengguna, manajemen data makanan, pelacakan olahraga (seperti lari, olahraga umum, dan gym), rekomendasi AI, serta integrasi dengan YouTube untuk konten kebugaran. Sistem ini menggunakan arsitektur RESTful API yang dibangun dengan Node.js dan Express.js, dengan database Supabase untuk penyimpanan data.

## Teknologi yang Digunakan
- **Node.js**: Runtime JavaScript untuk server-side.
- **Express.js**: Framework web untuk membangun API.
- **Supabase**: Platform backend-as-a-service untuk database (PostgreSQL) dan autentikasi.
- **Google Generative AI**: Untuk fitur AI, seperti rekomendasi kebugaran.
- **Axios**: Untuk HTTP requests ke layanan eksternal.
- **CORS**: Untuk menangani cross-origin requests.
- **Morgan**: Middleware untuk logging HTTP requests.
- **Multer**: Untuk handling file uploads (jika diperlukan).
- **Dotenv**: Untuk manajemen variabel lingkungan.
- **Vercel**: Untuk deployment (berdasarkan vercel.json).

## Struktur Repositori
```
backendfitmate/
├── .gitignore                 # File yang diabaikan oleh Git
├── package.json               # Konfigurasi proyek Node.js dan dependencies
├── package-lock.json          # Lock file untuk dependencies
├── vercel.json                # Konfigurasi deployment Vercel
├── src/
│   ├── index.js               # Entry point utama server Express
│   ├── config/
│   │   ├── gemini.js          # Konfigurasi Google Generative AI
│   │   └── supabase.js        # Konfigurasi koneksi Supabase
│   ├── controllers/           # Logika bisnis untuk setiap endpoint
│   │   ├── aiController.js    # Controller untuk fitur AI
│   │   ├── authController.js  # Controller untuk autentikasi
│   │   ├── foodController.js  # Controller untuk data makanan
│   │   ├── gymController.js   # Controller untuk gym
│   │   ├── runController.js   # Controller untuk lari
│   │   ├── sportsController.js # Controller untuk olahraga umum
│   │   └── youtubeController.js # Controller untuk integrasi YouTube
│   ├── middleware/
│   │   └── auth.js            # Middleware untuk autentikasi
│   └── routes/                # Definisi routes API
│       ├── ai.js              # Routes untuk AI
│       ├── auth.js            # Routes untuk autentikasi
│       ├── food.js            # Routes untuk makanan
│       ├── gym.js             # Routes untuk gym
│       ├── run.js             # Routes untuk lari
│       ├── sports.js          # Routes untuk olahraga
│       └── youtube.js         # Routes untuk YouTube
└── supabase/
    └── schema.sql             # Skema database Supabase
```

## Cara Setup di Local
1. **Persyaratan Sistem**:
   - Node.js (versi 14 atau lebih tinggi)
   - npm (sudah termasuk dengan Node.js)
   - Akun Supabase untuk database dan autentikasi
   - API key Google Generative AI (jika menggunakan fitur AI)

2. **Clone Repositori**:
   ```
   git clone <URL_REPOSITORI>
   cd backendfitmate
   ```

3. **Install Dependencies**:
   ```
   npm install
   ```

4. **Setup Environment Variables**:
   - Buat file `.env` di root direktori proyek.
   - Tambahkan variabel berikut (sesuaikan dengan konfigurasi Anda):
     ```
     PORT=3000
     SUPABASE_URL=<URL_SUPABASE_ANDA>
     SUPABASE_ANON_KEY=<ANON_KEY_SUPABASE_ANDA>
     GOOGLE_AI_API_KEY=<API_KEY_GOOGLE_GENERATIVE_AI>
     ```

5. **Setup Database**:
   - Jalankan skema database di Supabase menggunakan file `supabase/schema.sql`.
   - Pastikan koneksi Supabase sudah dikonfigurasi di `src/config/supabase.js`.

6. **Jalankan Server**:
   - Untuk mode development (dengan auto-reload):
     ```
     npm run dev
     ```
   - Untuk mode production:
     ```
     npm start
     ```
   - Server akan berjalan di `http://localhost:3000` (atau port yang ditentukan di .env).

7. **Test API**:
   - Gunakan tools seperti Postman atau curl untuk test endpoint, misalnya:
     ```
     curl http://localhost:3000/
     ```
     Harus mengembalikan "FitMate Backend is running".

Jika ada masalah selama setup, pastikan semua dependencies terinstall dengan benar dan variabel environment sudah dikonfigurasi.
