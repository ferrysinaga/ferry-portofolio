# Ferry Portfolio

Website portfolio pribadi Ferry untuk menampilkan profil, keahlian, dan project yang telah dikerjakan.

## Teknologi

- React
- TypeScript
- Vite
- ESLint

## Menjalankan Project

Pastikan Node.js sudah terpasang, lalu jalankan:

```bash
npm install
npm run dev
```

Buka alamat yang ditampilkan di terminal untuk melihat aplikasi di browser.

### Konfigurasi Supabase

Sebelum menjalankan aplikasi, buat file `.env.local` di folder project dengan URL
project Supabase dan anon key dari pengaturan API Supabase:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Ganti nilai contoh dengan nilai project Anda, lalu jalankan ulang server Vite.
Jangan gunakan `service_role` key di aplikasi frontend.

## Build Production

```bash
npm run build
```

Preview hasil build secara lokal dengan:

```bash
npm run preview
```
