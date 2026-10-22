import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '../../../supabaseClient';
import type { EducationItem } from './type';

export default function EducationManager() {
  const [data, setData] = useState<EducationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [form, setForm] = useState({ institution: '', degree: '', start_year: '', end_year: '', description: '' });
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchData = async () => {
    const { data } = await supabase.from('education').select('*').order('id', { ascending: false });
    if (data) setData(data);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = editingId 
      ? await supabase.from('education').update(form).eq('id', editingId)
      : await supabase.from('education').insert([form]);
      
    if (error) setMessage('❌ Failed: ' + error.message);
    else {
      setMessage(`✅ Education ${editingId ? 'updated' : 'added'}!`);
      setForm({ institution: '', degree: '', start_year: '', end_year: '', description: '' });
      setEditingId(null);
      fetchData();
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this?")) return;
    await supabase.from('education').delete().eq('id', id);
    fetchData();
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-1 bg-white border rounded-xl p-6 h-fit">
        <h3 className="font-semibold mb-4">{editingId ? 'Edit Education' : 'Add Education'}</h3>
        {message && <div className="mb-4 p-3 text-sm rounded-md border bg-gray-50">{message}</div>}
        <form onSubmit={handleSave} className="flex flex-col gap-3">
          <input type="text" value={form.institution} onChange={e => setForm({...form, institution: e.target.value})} className="border p-2 rounded-md text-sm" placeholder="Institution Name" required />
          <input type="text" value={form.degree} onChange={e => setForm({...form, degree: e.target.value})} className="border p-2 rounded-md text-sm" placeholder="Degree / Major" required />
          <div className="flex gap-2">
            <input type="text" value={form.start_year} onChange={e => setForm({...form, start_year: e.target.value})} className="w-1/2 border p-2 rounded-md text-sm" placeholder="Start Year" required />
            <input type="text" value={form.end_year} onChange={e => setForm({...form, end_year: e.target.value})} className="w-1/2 border p-2 rounded-md text-sm" placeholder="End Year" required />
          </div>
          <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="border p-2 rounded-md text-sm h-24" placeholder="Description / Activities" required />
          <button type="submit" disabled={loading} className="bg-blue-600 text-white py-2 rounded-md text-sm">Save Education</button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ institution: '', degree: '', start_year: '', end_year: '', description: '' }); }} className="bg-gray-100 text-gray-700 py-2 rounded-md text-sm mt-1">Cancel</button>}
        </form>
      </div>
      <div className="xl:col-span-2 bg-white border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50"><h3 className="text-xs font-bold text-gray-500 uppercase">Education List</h3></div>
        <div className="divide-y">
          {data.map(item => (
            <div key={item.id} className="p-5 flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-gray-900">{item.institution}</h4>
                <p className="text-sm font-medium text-gray-700">{item.degree}</p>
                <p className="text-xs text-gray-500 mb-2">{item.start_year} - {item.end_year}</p>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              <div className="flex flex-col gap-2 shrink-0 ml-4">
                <button onClick={() => { setEditingId(item.id); setForm(item); }} className="px-3 py-1.5 bg-gray-50 border text-xs rounded-md">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="px-3 py-1.5 bg-red-50 border border-red-100 text-red-600 text-xs rounded-md">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}