import React, { useState, useEffect, FormEvent } from 'react';
import { supabase } from '../../supabaseClient';
import { motion } from 'framer-motion';
import type { Session } from '@supabase/supabase-js';

// --- TYPES ---
type GalleryPhoto = {
  id: number;
  image_url: string;
  description: string;
};

type ProjectItem = {
  id: number;
  title: string;
  description: string;
  image_url: string;
  link?: string; // Tautan ke demo atau repo (opsional)
};

const Admin = () => {
  const [session, setSession] = useState<Session | null>(null);
  
  // State Login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // State Global
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // State Tab Navigasi ('gallery' atau 'projects')
  const [activeTab, setActiveTab] = useState<'gallery' | 'projects'>('gallery');

  // ===================== STATE GALLERY =====================
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDesc, setEditDesc] = useState('');

  // ===================== STATE PROJECTS =====================
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [projectFile, setProjectFile] = useState<File | null>(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectLink, setProjectLink] = useState('');
  
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [editProjectTitle, setEditProjectTitle] = useState('');
  const [editProjectDesc, setEditProjectDesc] = useState('');
  const [editProjectLink, setEditProjectLink] = useState('');

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

  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('id', { ascending: false });
    if (data) setProjects(data);
  };

  // 2. Tarik Data setelah Login (READ)
  useEffect(() => {
    if (session) {
      fetchPhotos();
      fetchProjects();
    }
  }, [session]);

  // 3. Logika Login & Logout
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage("❌ Gagal login: Email/Password salah!");
    
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // ===================== FUNGSI GALLERY =====================
  const handleUploadPhoto = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return setMessage("❌ Pilih file foto terlebih dahulu!");
    
    setLoading(true); setMessage('⏳ Mengunggah foto...');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `gallery_${Math.random()}.${fileExt}`;
      const bucketName = 'koleksi-foto'; 
      
      const { error: uploadError } = await supabase.storage.from(bucketName).upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(fileName);
      
      const { error: insertError } = await supabase.from('gallery').insert([{ image_url: publicUrlData.publicUrl, description }]);
      if (insertError) throw insertError;

      setMessage("✅ Foto berhasil ditambahkan!");
      setFile(null); setDescription('');
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      fetchPhotos(); 
    } catch (error: any) {
      setMessage("❌ Gagal: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePhoto = async (id: number) => {
    if (!window.confirm("Hapus foto ini?")) return;
    setLoading(true);
    const { error } = await supabase.from('gallery').delete().eq('id', id);
    if (error) setMessage("❌ Gagal menghapus foto.");
    else { setMessage("✅ Foto dihapus!"); fetchPhotos(); }
    setLoading(false);
  };

  const handleSaveEditPhoto = async (id: number) => {
    setLoading(true);
    const { error } = await supabase.from('gallery').update({ description: editDesc }).eq('id', id);
    if (error) setMessage("❌ Gagal mengubah deskripsi.");
    else { setMessage("✅ Deskripsi diperbarui!"); setEditingId(null); fetchPhotos(); }
    setLoading(false);
  };

  // ===================== FUNGSI PROJECTS =====================
  const handleUploadProject = async (e: FormEvent) => {
    e.preventDefault();
    if (!projectFile) return setMessage("❌ Pilih gambar project terlebih dahulu!");
    
    setLoading(true); setMessage('⏳ Menyimpan project...');

    try {
      const fileExt = projectFile.name.split('.').pop();
      const fileName = `project_${Math.random()}.${fileExt}`;
      const bucketName = 'koleksi-foto'; // Menggunakan bucket yang sama
      
      const { error: uploadError } = await supabase.storage.from(bucketName).upload(fileName, projectFile);
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(fileName);
      
      const { error: insertError } = await supabase.from('projects').insert([
        { 
          title: projectTitle, 
          description: projectDesc, 
          image_url: publicUrlData.publicUrl, 
          link: projectLink 
        }
      ]);
      if (insertError) throw insertError;

      setMessage("✅ Project berhasil ditambahkan!");
      setProjectFile(null); setProjectTitle(''); setProjectDesc(''); setProjectLink('');
      const fileInput = document.getElementById('project-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      fetchProjects(); 
    } catch (error: any) {
      setMessage("❌ Gagal: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!window.confirm("Hapus project ini?")) return;
    setLoading(true);
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) setMessage("❌ Gagal menghapus project.");
    else { setMessage("✅ Project dihapus!"); fetchProjects(); }
    setLoading(false);
  };

  const handleSaveEditProject = async (id: number) => {
    setLoading(true);
    const { error } = await supabase.from('projects').update({ 
      title: editProjectTitle, 
      description: editProjectDesc, 
      link: editProjectLink 
    }).eq('id', id);
    
    if (error) setMessage("❌ Gagal mengubah project.");
    else { setMessage("✅ Project diperbarui!"); setEditingProjectId(null); fetchProjects(); }
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Halo, {session.user?.email}</p>
          </div>
          <button onClick={handleLogout} className="text-red-500 font-bold border-2 border-red-500 px-6 py-2 rounded hover:bg-red-50 transition-colors">
            Logout
          </button>
        </div>

        {/* Tab Navigasi */}
        <div className="flex gap-2 sm:gap-4 mb-6 border-b-2 border-gray-200 pb-2 overflow-x-auto">
          <button 
            onClick={() => { setActiveTab('gallery'); setMessage(''); }} 
            className={`font-bold px-4 py-2 rounded-t-md transition-colors whitespace-nowrap ${activeTab === 'gallery' ? 'bg-[#1d1d1d] text-white' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            📸 Kelola Gallery
          </button>
          <button 
            onClick={() => { setActiveTab('projects'); setMessage(''); }} 
            className={`font-bold px-4 py-2 rounded-t-md transition-colors whitespace-nowrap ${activeTab === 'projects' ? 'bg-[#1d1d1d] text-white' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            🚀 Kelola Projects
          </button>
        </div>

        {message && <p className={`mb-6 font-bold p-4 rounded ${message.includes('❌') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{message}</p>}

        {/* ===================== KONTEN BERDASARKAN TAB ===================== */}
        
        {activeTab === 'gallery' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* KOLOM KIRI: FORM UPLOAD GALLERY */}
            <div className="lg:col-span-1 bg-gray-50 p-6 rounded-md border-2 border-gray-100 h-fit">
              <h2 className="text-xl font-bold mb-4 border-b-2 border-gray-200 pb-2">🖼️ Upload Foto</h2>
              <form onSubmit={handleUploadPhoto} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Pilih File Image</label>
                  <input id="file-upload" type="file" accept="image/*" onChange={e => setFile(e.target.files ? e.target.files[0] : null)} className="w-full bg-white border-2 border-gray-200 p-2 rounded text-sm" required />
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

            {/* KOLOM KANAN: DAFTAR GALLERY */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold mb-4 border-b-2 border-gray-100 pb-2">📂 Daftar Gallery</h2>
              {photos.length === 0 ? (
                <p className="text-gray-500 italic">Galeri masih kosong.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {photos.map((photo) => (
                    <div key={photo.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white border-2 border-gray-100 p-3 rounded-md shadow-sm">
                      <img src={photo.image_url} alt={photo.description} className="w-full sm:w-24 h-24 object-cover rounded bg-gray-200" />
                      <div className="flex-1 w-full">
                        {editingId === photo.id ? (
                          <input type="text" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} className="w-full border-2 border-blue-400 p-2 rounded text-sm mb-2" autoFocus />
                        ) : (
                          <p className="font-bold text-gray-800">{photo.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        {editingId === photo.id ? (
                          <>
                            <button onClick={() => handleSaveEditPhoto(photo.id)} className="bg-green-500 text-white px-3 py-1 rounded text-xs font-bold w-full sm:w-auto">Simpan</button>
                            <button onClick={() => setEditingId(null)} className="bg-gray-300 text-gray-800 px-3 py-1 rounded text-xs font-bold w-full sm:w-auto">Batal</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => { setEditingId(photo.id); setEditDesc(photo.description); }} className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs font-bold hover:bg-blue-200 w-full sm:w-auto">Edit</button>
                            <button onClick={() => handleDeletePhoto(photo.id)} className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs font-bold hover:bg-red-200 w-full sm:w-auto">Hapus</button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* KOLOM KIRI: FORM UPLOAD PROJECT */}
            <div className="lg:col-span-1 bg-gray-50 p-6 rounded-md border-2 border-gray-100 h-fit">
              <h2 className="text-xl font-bold mb-4 border-b-2 border-gray-200 pb-2">🚀 Tambah Project</h2>
              <form onSubmit={handleUploadProject} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Gambar Project (Wajib)</label>
                  <input id="project-upload" type="file" accept="image/*" onChange={e => setProjectFile(e.target.files ? e.target.files[0] : null)} className="w-full bg-white border-2 border-gray-200 p-2 rounded text-sm" required />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Judul Project</label>
                  <input type="text" value={projectTitle} onChange={e => setProjectTitle(e.target.value)} className="w-full border-2 border-gray-200 p-3 rounded text-sm" placeholder="Misal: E-Commerce App" required />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Deskripsi Singkat</label>
                  <textarea value={projectDesc} onChange={e => setProjectDesc(e.target.value)} className="w-full border-2 border-gray-200 p-3 rounded text-sm h-20" placeholder="Aplikasi ini dibuat dengan React..." required />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Tautan URL (Opsional)</label>
                  <input type="url" value={projectLink} onChange={e => setProjectLink(e.target.value)} className="w-full border-2 border-gray-200 p-3 rounded text-sm" placeholder="https://github.com/..." />
                </div>
                <button type="submit" disabled={loading} className="bg-[#1d1d1d] text-white p-3 rounded font-bold mt-2 hover:scale-[1.02] transition-transform text-sm">
                  {loading ? 'Memproses...' : '+ Tambah Project'}
                </button>
              </form>
            </div>

            {/* KOLOM KANAN: DAFTAR PROJECTS */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold mb-4 border-b-2 border-gray-100 pb-2">📂 Daftar Projects</h2>
              {projects.length === 0 ? (
                <p className="text-gray-500 italic">Project masih kosong.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {projects.map((proj) => (
                    <div key={proj.id} className="flex flex-col sm:flex-row items-start gap-4 bg-white border-2 border-gray-100 p-4 rounded-md shadow-sm">
                      <img src={proj.image_url} alt={proj.title} className="w-full sm:w-32 h-24 object-cover rounded bg-gray-200" />
                      <div className="flex-1 w-full">
                        {editingProjectId === proj.id ? (
                          <div className="flex flex-col gap-2">
                            <input type="text" value={editProjectTitle} onChange={(e) => setEditProjectTitle(e.target.value)} className="w-full border-2 border-blue-400 p-2 rounded text-sm font-bold" placeholder="Judul" autoFocus />
                            <textarea value={editProjectDesc} onChange={(e) => setEditProjectDesc(e.target.value)} className="w-full border-2 border-blue-400 p-2 rounded text-sm" placeholder="Deskripsi" />
                            <input type="url" value={editProjectLink} onChange={(e) => setEditProjectLink(e.target.value)} className="w-full border-2 border-blue-400 p-2 rounded text-sm" placeholder="Link URL" />
                          </div>
                        ) : (
                          <>
                            <h3 className="font-bold text-gray-900 text-lg">{proj.title}</h3>
                            <p className="text-sm text-gray-600 my-1 line-clamp-2">{proj.description}</p>
                            {proj.link && (
                              <a href={proj.link} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline line-clamp-1">
                                {proj.link}
                              </a>
                            )}
                          </>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 w-full sm:w-auto">
                        {editingProjectId === proj.id ? (
                          <>
                            <button onClick={() => handleSaveEditProject(proj.id)} className="bg-green-500 text-white px-3 py-2 rounded text-xs font-bold">Simpan</button>
                            <button onClick={() => setEditingProjectId(null)} className="bg-gray-300 text-gray-800 px-3 py-2 rounded text-xs font-bold">Batal</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => { 
                              setEditingProjectId(proj.id); 
                              setEditProjectTitle(proj.title); 
                              setEditProjectDesc(proj.description); 
                              setEditProjectLink(proj.link || ''); 
                            }} className="bg-blue-100 text-blue-700 px-3 py-2 rounded text-xs font-bold hover:bg-blue-200">Edit</button>
                            <button onClick={() => handleDeleteProject(proj.id)} className="bg-red-100 text-red-700 px-3 py-2 rounded text-xs font-bold hover:bg-red-200">Hapus</button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </motion.div>
  );
};

export default Admin;