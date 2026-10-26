import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '../../../supabaseClient';
import type { EducationItem } from './type';

export default function EducationManager() {
  const [data, setData] = useState<EducationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  
  const [form, setForm] = useState({ institution: '', degree: '', start_year: '', end_year: '', description: '', logo: '' });
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchData = async () => {
    const { data } = await supabase.from('education').select('*').order('id', { ascending: false });
    return data;
  };

  useEffect(() => {
    let active = true;
    void fetchData().then(data => {
      if (active && data) setData(data);
    });
    return () => { active = false; };
  }, []);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('⏳ Saving education...');
    let failureStage = file ? 'photo upload' : 'database save';

    try {
      let logo = form.logo;
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `education_${crypto.randomUUID()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('koleksi-foto').upload(fileName, file);
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from('koleksi-foto').getPublicUrl(fileName);
        logo = urlData.publicUrl;
      }

      failureStage = 'database save';
      const payload = { ...form, logo };
      const { error } = editingId
        ? await supabase.from('education').update(payload).eq('id', editingId)
        : await supabase.from('education').insert([payload]);
      if (error) throw error;

      setMessage(`✅ Education ${editingId ? 'updated' : 'added'}!`);
      setForm({ institution: '', degree: '', start_year: '', end_year: '', description: '', logo: '' });
      setFile(null);
      setEditingId(null);
      const fileInput = document.getElementById('education-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      const updatedData = await fetchData();
      if (updatedData) setData(updatedData);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setMessage(`❌ Failed during ${failureStage}: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this?")) return;
    setLoading(true);
    const { error } = await supabase.from('education').delete().eq('id', id);
    if (error) {
      setMessage('❌ Failed to delete: ' + error.message);
    } else {
      const updatedData = await fetchData();
      if (updatedData) setData(updatedData);
      setMessage('✅ Education deleted!');
    }
    setLoading(false);
  };

  const resetForm = () => {
    setEditingId(null);
    setFile(null);
    setForm({ institution: '', degree: '', start_year: '', end_year: '', description: '', logo: '' });
    const fileInput = document.getElementById('education-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="admin-manager grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
      <div className="xl:col-span-1 bg-white border rounded-xl p-6 h-fit">
        <h3 className="font-semibold mb-4">{editingId ? 'Edit Education' : 'Add Education'}</h3>
        {message && <div className="mb-4 p-3 text-sm rounded-md border bg-gray-50">{message}</div>}
        <form onSubmit={handleSave} className="flex flex-col gap-3">
          <label className="flex flex-col gap-2 text-sm font-medium">
            Institution Photo / Logo
            <input
              id="education-upload"
              type="file"
              accept="image/*"
              onChange={e => setFile(e.target.files?.[0] ?? null)}
              className="border p-2 text-sm"
            />
          </label>
          {form.logo && (
            <img
              src={form.logo}
              alt="Education logo preview"
              className="h-24 w-24 border-2 border-[#1d1d1d] bg-white object-contain p-2"
            />
          )}
          {file && <p className="text-xs font-medium text-gray-600">Selected: {file.name}</p>}
          <input type="text" value={form.institution} onChange={e => setForm({...form, institution: e.target.value})} className="border p-2 rounded-md text-sm" placeholder="Institution Name" required />
          <input type="text" value={form.degree} onChange={e => setForm({...form, degree: e.target.value})} className="border p-2 rounded-md text-sm" placeholder="Degree / Major" required />
          <div className="flex gap-2">
            <input type="text" value={form.start_year} onChange={e => setForm({...form, start_year: e.target.value})} className="w-1/2 border p-2 rounded-md text-sm" placeholder="Start Year" required />
            <input type="text" value={form.end_year} onChange={e => setForm({...form, end_year: e.target.value})} className="w-1/2 border p-2 rounded-md text-sm" placeholder="End Year" required />
          </div>
          <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="border p-2 rounded-md text-sm h-24" placeholder="Description / Activities" required />
          <button type="submit" disabled={loading} className="bg-blue-600 text-white py-2 rounded-md text-sm">{loading ? 'Saving...' : 'Save Education'}</button>
          {editingId && <button type="button" onClick={resetForm} className="bg-gray-100 text-gray-700 py-2 rounded-md text-sm mt-1">Cancel</button>}
        </form>
      </div>
      <div className="xl:col-span-2 bg-white border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50"><h3 className="text-xs font-bold text-gray-500 uppercase">Education List</h3></div>
        <div className="divide-y">
          {data.map(item => (
            <div key={item.id} className="p-5 flex justify-between items-start">
              {item.logo && <img src={item.logo} alt={`${item.institution} logo`} className="mr-4 h-16 w-16 shrink-0 border-2 border-[#1d1d1d] bg-white object-contain p-1" />}
              <div>
                <h4 className="font-semibold text-gray-900">{item.institution}</h4>
                <p className="text-sm font-medium text-gray-700">{item.degree}</p>
                <p className="text-xs text-gray-500 mb-2">{item.start_year} - {item.end_year}</p>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              <div className="flex flex-col gap-2 shrink-0 ml-4">
                <button disabled={loading} onClick={() => { setEditingId(item.id); setFile(null); setForm({ institution: item.institution, degree: item.degree, start_year: item.start_year, end_year: item.end_year, description: item.description, logo: item.logo ?? '' }); }} className="px-3 py-1.5 bg-gray-50 border text-xs rounded-md">Edit</button>
                <button disabled={loading} onClick={() => handleDelete(item.id)} className="px-3 py-1.5 bg-red-50 border border-red-100 text-red-600 text-xs rounded-md">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}