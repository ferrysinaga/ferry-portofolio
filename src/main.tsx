import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root')!)
const supabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY,
)

if (!supabaseConfigured) {
  root.render(
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', color: '#1d1d1d' }}>
      <h1>Konfigurasi Supabase belum lengkap</h1>
      <p>
        Buat file <code>.env.local</code> di folder project dan isi
        <code> VITE_SUPABASE_URL</code> serta <code>VITE_SUPABASE_ANON_KEY</code>.
        Setelah itu, jalankan ulang server.
      </p>
    </main>,
  )
} else {
  import('./app')
    .then(({ default: App }) => {
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>,
      )
    })
    .catch((error: unknown) => {
      console.error('Failed to load the application:', error)
      root.render(
        <main style={{ padding: '2rem', fontFamily: 'sans-serif', color: '#1d1d1d' }}>
          <h1>Aplikasi gagal dimuat</h1>
          <p>Periksa konfigurasi Supabase dan console browser untuk detail error.</p>
        </main>,
      )
    })
}
