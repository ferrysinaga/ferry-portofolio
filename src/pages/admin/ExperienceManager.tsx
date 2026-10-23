import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '../../../supabaseClient';
import type { ExperienceItem } from './type';

export default function ExperienceManager() {
  const [data, setData] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [form, setForm] = useState({ company: '', role: '', start_date: '', end_date: '', description: '' });
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchData = async () => {
    const { data } = await supabase.from('experiences').select('*').order('id', { ascending: false });
    if (data) setData(data);
  };

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      const { data } = await supabase.from('experiences').select('*').order('id', { ascending: false });
      if (isMounted && data) setData(data);
    };

    void loadData();
    return () => { isMounted = false; };
  }, []);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = editingId 
      ? await supabase.from('experiences').update(form).eq('id', editingId)
      : await supabase.from('experiences').insert([form]);
      
    if (error) setMessage('❌ Failed: ' + error.message);
    else {
      setMessage(`✅ Experience ${editingId ? 'updated' : 'added'}!`);
      setForm({ company: '', role: '', start_date: '', end_date: '', description: '' });
      setEditingId(null);
      fetchData();
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this?")) return;
    await supabase.from('experiences').delete().eq('id', id);
    fetchData();
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-1 bg-white border rounded-xl p-6 h-fit">
        <h3 className="font-semibold mb-4">{editingId ? 'Edit Experience' : 'Add Experience'}</h3>
        {message && <div className="mb-4 p-3 text-sm rounded-md border bg-gray-50">{message}</div>}
        <form onSubmit={handleSave} className="flex flex-col gap-3">
          <input type="text" value={form.company} onChange={e => setForm({...form, company: e.target.value})} className="border p-2 rounded-md text-sm" placeholder="Company Name" required />
          <input type="text" value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="border p-2 rounded-md text-sm" placeholder="Role / Job Title" required />
          <div className="flex gap-2">
            <input type="text" value={form.start_date} onChange={e => setForm({...form, start_date: e.target.value})} className="w-1/2 border p-2 rounded-md text-sm" placeholder="Start Date (e.g. Jan 2023)" required />
            <input type="text" value={form.end_date} onChange={e => setForm({...form, end_date: e.target.value})} className="w-1/2 border p-2 rounded-md text-sm" placeholder="End Date (e.g. Present)" required />
          </div>
          <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="border p-2 rounded-md text-sm h-24" placeholder="Job Description" required />
          <button type="submit" disabled={loading} className="bg-blue-600 text-white py-2 rounded-md text-sm">Save Experience</button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ company: '', role: '', start_date: '', end_date: '', description: '' }); }} className="bg-gray-100 text-gray-700 py-2 rounded-md text-sm mt-1">Cancel Edit</button>}
        </form>
      </div>
      <div className="xl:col-span-2 bg-white border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50"><h3 className="text-xs font-bold text-gray-500 uppercase">Experience List</h3></div>
        <div className="divide-y">
          {data.map(item => (
            <div key={item.id} className="p-5 flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-gray-900">{item.role} <span className="text-blue-600">@ {item.company}</span></h4>
                <p className="text-xs text-gray-500 mb-2">{item.start_date} - {item.end_date}</p>
                <p className="text-sm text-gray-700 whitespace-pre-line">{item.description}</p>
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