import React, { useState, useEffect, FormEvent } from 'react';
import { supabase } from '../../supabaseClient';
import { motion } from 'framer-motion';
import type { Session } from '@supabase/supabase-js';

type GalleryPhoto = {
  id: number;
  image_url: string;
  description: string;
};

const Admin = () => {
  const [session, setSession] = useState<Session | null>(null);
  
  // State Login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // State Global
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // State Form Upload (CREATE)
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');

  // State Daftar Foto (READ)
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);

  // State Edit Deskripsi (UPDATE)
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDesc, setEditDesc] = useState('');

  // 1. Cek Sesi Login
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const fetchPhotos = async () => {
    const { data } = await supabase.from('gallery').select('*').order('id', { ascending: false });
    if (data) setPhotos(data);
  };

  // 2. Tarik Data Foto setelah Login (READ)
  useEffect(() => {
    if (session) {
      fetchPhotos();
    }
  }, [session]);

  // 3. Logika Login & Logout
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage("❌ Gagal login: Email/Password salah!");
    }
    
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // 4. Logika Upload Foto (CREATE)
  const handleUploadPhoto = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage("❌ Pilih file foto terlebih dahulu!");
      return;
    }
    
    setLoading(true);
    setMessage('⏳ Mengunggah foto...');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const bucketName = 'koleksi-foto'; // Sesuaikan dengan nama bucket Anda
      
      const { error: uploadError } = await supabase.storage.from(bucketName).upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(fileName);
      const publicUrl = publicUrlData.publicUrl;

      const { error: insertError } = await supabase.from('gallery').insert([
        { image_url: publicUrl, description: description }
      ]);
      if (insertError) throw insertError;

      setMessage("✅ Foto berhasil ditambahkan!");
      setFile(null);
      setDescription('');
      
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      fetchPhotos(); // Refresh daftar foto otomatis

    } catch (error: any) {
      setMessage("❌ Gagal: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 5. Logika Hapus Foto (DELETE)
  const handleDelete = async (id: number) => {
    const isConfirm = window.confirm("Apakah Anda yakin ingin menghapus foto ini?");
    if (!isConfirm) return;

    setLoading(true);
    const { error } = await supabase.from('gallery').delete().eq('id', id);
    if (error) {
      setMessage("❌ Gagal menghapus foto.");
    } else {
      setMessage("✅ Foto berhasil dihapus!");
      fetchPhotos(); // Refresh daftar
    }
    setLoading(false);
  };

  // 6. Logika Simpan Edit Deskripsi (UPDATE)
  const handleSaveEdit = async (id: number) => {
    setLoading(true);
    const { error } = await supabase.from('gallery').update({ description: editDesc }).eq('id', id);
    
    if (error) {
      setMessage("❌ Gagal mengubah deskripsi.");
    } else {
      setMessage("✅ Deskripsi berhasil diperbarui!");
      setEditingId(null);
      fetchPhotos(); // Refresh daftar
    }
    setLoading(false);
  };

  // ================= TAMPILAN HALAMAN LOGIN =================
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-md shadow-xl w-full max-w-sm flex flex-col gap-5">
          <h1 className="text-2xl font-bold text-center mb-2">Restricted Area</h1>
          {message && <p className="text-red-500 text-sm font-bold text-center">{message}</p>}
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="border-2 border-gray-200 p-3 rounded" required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="border-2 border-gray-200 p-3 rounded" required />
          <button type="submit" disabled={loading} className="bg-[#1d1d1d] text-white p-3 rounded font-bold hover:scale-[1.02] transition-transform">
            {loading ? 'Mengecek...' : 'Login'}
          </button>
        </form>
      </div>
    );
  }

  // ================= TAMPILAN DASHBOARD ADMIN =================
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="min-h-screen bg-gray-50 p-6 md:p-10" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
      <div className="max-w-5xl mx-auto bg-white p-8 shadow-xl rounded-md border-t-8 border-[#1d1d1d]">
        
        {/* Header Admin */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Halo, {session.user?.email}</p>
          </div>
          <button onClick={handleLogout} className="text-red-500 font-bold border-2 border-red-500 px-6 py-2 rounded hover:bg-red-50 transition-colors">
            Logout
          </button>
        </div>

        {message && <p className={`mb-6 font-bold p-4 rounded ${message.includes('❌') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{message}</p>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* KOLOM KIRI: FORM UPLOAD (CREATE) */}
          <div className="lg:col-span-1 bg-gray-50 p-6 rounded-md border-2 border-gray-100 h-fit">
            <h2 className="text-xl font-bold mb-4 border-b-2 border-gray-200 pb-2">🖼️ Upload Foto Baru</h2>
            <form onSubmit={handleUploadPhoto} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-bold mb-2">Pilih File (JPG/PNG)</label>
                <input id="file-upload" type="file" accept="image/*" onChange={e => setFile(e.target.files ? e.target.files[0] : null)} className="w-full bg-white border-2 border-gray-200 p-2 rounded cursor-pointer text-sm" required />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Deskripsi Foto</label>
                <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full border-2 border-gray-200 p-3 rounded text-sm" placeholder="Misal: Pemandangan Kota" required />
              </div>
              <button type="submit" disabled={loading} className="bg-[#1d1d1d] text-white p-3 rounded font-bold mt-2 hover:scale-[1.02] transition-transform text-sm">
                {loading ? 'Memproses...' : '+ Unggah Foto'}
              </button>
            </form>
          </div>

          {/* KOLOM KANAN: DAFTAR FOTO (READ, UPDATE, DELETE) */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-4 border-b-2 border-gray-100 pb-2">📂 Kelola Galeri Anda</h2>
            
            {photos.length === 0 ? (
              <p className="text-gray-500 italic">Galeri masih kosong.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {photos.map((photo) => (
                  <div key={photo.id} className="flex items-center gap-4 bg-white border-2 border-gray-100 p-3 rounded-md shadow-sm">
                    {/* Thumbnail Gambar */}
                    <img src={photo.image_url} alt={photo.description} className="w-20 h-20 object-cover rounded bg-gray-200" />
                    
                    {/* Area Teks / Edit */}
                    <div className="flex-1">
                      {editingId === photo.id ? (
                        <input 
                          type="text" 
                          value={editDesc} 
                          onChange={(e) => setEditDesc(e.target.value)} 
                          className="w-full border-2 border-blue-400 p-2 rounded text-sm"
                          autoFocus
                        />
                      ) : (
                        <p className="font-bold text-gray-800">{photo.description}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">ID: {photo.id}</p>
                    </div>

                    {/* Tombol Aksi */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      {editingId === photo.id ? (
                        <>
                          <button onClick={() => handleSaveEdit(photo.id)} className="bg-green-500 text-white px-3 py-1 rounded text-xs font-bold">Simpan</button>
                          <button onClick={() => setEditingId(null)} className="bg-gray-300 text-gray-800 px-3 py-1 rounded text-xs font-bold">Batal</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => { setEditingId(photo.id); setEditDesc(photo.description); }} className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs font-bold hover:bg-blue-200">Edit</button>
                          <button onClick={() => handleDelete(photo.id)} className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs font-bold hover:bg-red-200">Hapus</button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default Admin;