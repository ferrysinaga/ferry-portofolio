import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '../../../supabaseClient';
import type { GalleryPhoto } from './type';

export default function GalleryManager() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDesc, setEditDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchPhotos = async () => {
    const { data } = await supabase.from('gallery').select('*').order('id', { ascending: false });
    return data ?? [];
  };

  useEffect(() => {
    void fetchPhotos().then(setPhotos);
  }, []);

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return setMessage("❌ Please select a photo first!");
    setLoading(true); setMessage('⏳ Uploading...');
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `gallery_${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('koleksi-foto').upload(fileName, file);
      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage.from('koleksi-foto').getPublicUrl(fileName);
      const { error: insertError } = await supabase.from('gallery').insert([{ image_url: urlData.publicUrl, description }]);
      if (insertError) throw insertError;
      
      setMessage("✅ Photo added!"); setFile(null); setDescription('');
      (document.getElementById('file-upload') as HTMLInputElement).value = '';
      void fetchPhotos().then(setPhotos);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setMessage('❌ Failed: ' + msg);
    } finally { 
      setLoading(false); 
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this photo?")) return;
    setLoading(true);
    const { error } = await supabase.from('gallery').delete().eq('id', id);
    if (error) setMessage("❌ Failed to delete.");
    else { setMessage("✅ Photo deleted!"); void fetchPhotos().then(setPhotos); }
    setLoading(false);
  };

  const handleSaveEdit = async (id: number) => {
    setLoading(true);
    const { error } = await supabase.from('gallery').update({ description: editDesc }).eq('id', id);
    if (error) setMessage("❌ Failed to update.");
    else { setMessage("✅ Updated!"); setEditingId(null); void fetchPhotos().then(setPhotos); }
    setLoading(false);
  };

  return (
    <div className="admin-manager grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
      {/* KIRI: Form */}
      <div className="xl:col-span-1 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">Add New Photo</h3>
        {message && <div className={`mb-4 p-3 text-sm rounded-md border ${message.includes('❌') ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>{message}</div>}
        <form onSubmit={handleUpload} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image File</label>
            <input id="file-upload" type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] ?? null)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 border border-gray-300 rounded-md p-1" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm h-20 resize-none" placeholder="A brief description..." required />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2.5 rounded-md font-medium hover:bg-blue-700 transition-colors text-sm">
            {loading ? 'Processing...' : 'Upload Photo'}
          </button>
        </form>
      </div>

      {/* KANAN: List */}
      <div className="xl:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Uploaded Photos</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {photos.length === 0 ? <div className="p-8 text-center text-gray-500 text-sm">No photos found.</div> : photos.map(photo => (
            <div key={photo.id} className="p-5 flex flex-col sm:flex-row gap-5 items-start hover:bg-slate-50 transition-colors">
              <img src={photo.image_url} alt="" className="w-full sm:w-24 h-24 rounded-lg object-cover border border-gray-200 shrink-0" />
              <div className="flex-1 w-full">
                {editingId === photo.id ? (
                  <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm h-20 mb-2" autoFocus />
                ) : <p className="text-sm text-gray-800">{photo.description}</p>}
              </div>
              <div className="flex sm:flex-col gap-2 shrink-0">
                {editingId === photo.id ? (
                  <>
                    <button onClick={() => handleSaveEdit(photo.id)} className="px-4 py-2 bg-green-600 text-white text-xs rounded-md">Save</button>
                    <button onClick={() => setEditingId(null)} className="px-4 py-2 bg-white border text-gray-700 text-xs rounded-md">Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { setEditingId(photo.id); setEditDesc(photo.description); }} className="px-4 py-2 bg-white border text-gray-700 text-xs rounded-md">Edit</button>
                    <button onClick={() => handleDelete(photo.id)} className="px-4 py-2 bg-white border border-red-200 text-red-600 text-xs rounded-md">Delete</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}