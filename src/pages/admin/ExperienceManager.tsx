import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '../../../supabaseClient';
import type { ExperienceItem } from './type';

export default function ExperienceManager() {
  const [data, setData] = useState<(ExperienceItem & { image_url?: string })[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({ company: '', role: '', start_date: '', end_date: '', description: '', image_url: '' });
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchData = async () => {
    const { data } = await supabase.from('experiences').select('*').order('id', { ascending: false });
    if (data) setData(data);
  };

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      const { data } = await supabase.from('experiences').select('*').order('id', { ascending: false });
      if (!cancelled && data) setData(data);
    };

    void loadData();
    return () => { cancelled = true; };
  }, []);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('⏳ Saving experience...');

    try {
      let imageUrl = form.image_url;

      // Jika ada file gambar baru yang dipilih, upload ke Supabase Storage
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `exp_${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('koleksi-foto').upload(fileName, file);
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from('koleksi-foto').getPublicUrl(fileName);
        imageUrl = urlData.publicUrl;
      }

      const payload = { ...form, image_url: imageUrl };

      const { error } = editingId 
        ? await supabase.from('experiences').update(payload).eq('id', editingId)
        : await supabase.from('experiences').insert([payload]);
        
      if (error) throw error;

      setMessage(`✅ Experience ${editingId ? 'updated' : 'added'} successfully!`);
      setForm({ company: '', role: '', start_date: '', end_date: '', description: '', image_url: '' });
      setFile(null);
      setEditingId(null);
      const fileInput = document.getElementById('exp-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      fetchData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setMessage('❌ Failed: ' + msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this experience?")) return;
    await supabase.from('experiences').delete().eq('id', id);
    fetchData();
  };

  const handleEditClick = (item: ExperienceItem & { image_url?: string }) => {
    setEditingId(item.id);
    setForm({
      company: item.company,
      role: item.role,
      start_date: item.start_date,
      end_date: item.end_date,
      description: item.description,
      image_url: item.image_url || ''
    });
    setFile(null);
  };

  const inputClass = "w-full border-2 border-[#1d1d1d] p-3 text-[#1d1d1d] text-sm focus:outline-none focus:translate-x-[-3px] focus:translate-y-[-3px] focus:shadow-[4px_4px_0px_0px_#1d1d1d] transition-all rounded-none bg-white";
  const btnClass = "bg-[#1d1d1d] text-white py-3 font-bold border-2 border-[#1d1d1d] shadow-[4px_4px_0px_0px_#e5e7eb] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-300 rounded-none uppercase tracking-wider text-sm";

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
      
      {/* FORM KOLOM KIRI */}
      <div className="xl:col-span-1 bg-white border-4 border-[#1d1d1d] shadow-[8px_8px_0px_0px_#1d1d1d] p-6 h-fit">
        <h3 className="text-xl font-bold text-[#1d1d1d] uppercase mb-5 pb-3 border-b-4 border-[#1d1d1d]">
          {editingId ? 'Edit Experience' : 'Add Experience'}
        </h3>
        
        {message && (
          <div className={`mb-5 p-3 border-2 border-[#1d1d1d] text-sm font-bold shadow-[3px_3px_0px_0px_#1d1d1d] ${message.includes('❌') ? 'bg-red-100' : 'bg-green-100'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Company Logo / Image</label>
            <input id="exp-upload" type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] ?? null)} className="w-full border-2 border-[#1d1d1d] p-2 text-sm bg-gray-50 file:mr-4 file:py-1 file:px-3 file:border-0 file:text-xs file:font-bold file:bg-[#1d1d1d] file:text-white" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Company Name</label>
            <input type="text" value={form.company} onChange={e => setForm({...form, company: e.target.value})} className={inputClass} placeholder="Company Name" required />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Role / Job Title</label>
            <input type="text" value={form.role} onChange={e => setForm({...form, role: e.target.value})} className={inputClass} placeholder="Role / Job Title" required />
          </div>
          <div className="flex gap-2">
            <div className="w-1/2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Start Date</label>
              <input type="text" value={form.start_date} onChange={e => setForm({...form, start_date: e.target.value})} className={inputClass} placeholder="Jan 2023" required />
            </div>
            <div className="w-1/2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">End Date</label>
              <input type="text" value={form.end_date} onChange={e => setForm({...form, end_date: e.target.value})} className={inputClass} placeholder="Present" required />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className={`${inputClass} h-28 resize-none`} placeholder="Job description..." required />
          </div>

          <button type="submit" disabled={loading} className={btnClass}>
            {loading ? 'Processing...' : (editingId ? 'Update Experience' : 'Save Experience')}
          </button>

          {editingId && (
            <button 
              type="button" 
              onClick={() => { 
                setEditingId(null); 
                setForm({ company: '', role: '', start_date: '', end_date: '', description: '', image_url: '' }); 
                setFile(null);
              }} 
              className="w-full bg-gray-200 text-[#1d1d1d] py-2 font-bold border-2 border-[#1d1d1d] uppercase text-sm mt-1"
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      {/* LIST KANAN */}
      <div className="xl:col-span-2 bg-white border-4 border-[#1d1d1d] shadow-[8px_8px_0px_0px_#1d1d1d] overflow-hidden h-fit">
        <div className="px-6 py-4 border-b-4 border-[#1d1d1d] bg-[#1d1d1d] text-white">
          <h3 className="text-sm font-bold uppercase tracking-widest">Experience List</h3>
        </div>
        <div className="divide-y-2 divide-[#1d1d1d]">
          {data.length === 0 ? (
            <div className="p-8 text-center text-gray-500 font-medium">No experience recorded yet.</div>
          ) : (
            data.map(item => (
              <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-5 items-start justify-between hover:bg-yellow-50 transition-colors">
                <div className="flex gap-4 items-start">
                  {item.image_url ? (
                    <img src={item.image_url} alt="" className="w-16 h-16 object-cover border-2 border-[#1d1d1d] shrink-0 bg-gray-100 shadow-[2px_2px_0px_0px_#1d1d1d]" />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 border-2 border-[#1d1d1d] flex items-center justify-center font-bold text-xs text-gray-500 shrink-0 shadow-[2px_2px_0px_0px_#1d1d1d]">NO IMG</div>
                  )}
                  <div>
                    <h4 className="font-bold text-lg text-[#1d1d1d]">{item.role} <span className="text-blue-600 font-medium">@ {item.company}</span></h4>
                    <p className="text-xs font-bold text-gray-500 my-1 font-mono">{item.start_date} - {item.end_date}</p>
                    <p className="text-sm text-gray-700 whitespace-pre-line mt-2">{item.description}</p>
                  </div>
                </div>
                <div className="flex sm:flex-col gap-2 shrink-0">
                  <button onClick={() => handleEditClick(item)} className="px-4 py-2 bg-white border-2 border-[#1d1d1d] text-xs font-bold uppercase shadow-[2px_2px_0px_0px_#1d1d1d] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="px-4 py-2 bg-red-100 border-2 border-[#1d1d1d] text-red-600 text-xs font-bold uppercase shadow-[2px_2px_0px_0px_#1d1d1d] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}