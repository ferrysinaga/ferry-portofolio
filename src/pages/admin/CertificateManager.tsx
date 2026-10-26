import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '../../../supabaseClient';
import type { CertificateItem } from './type';

export default function CertificateManager() {
  const [data, setData] = useState<CertificateItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({ title: '', issuer: '', date: '', credential_id: '' });

  const fetchData = async () => {
    const { data } = await supabase.from('certificates').select('*').order('id', { ascending: false });
    if (data) setData(data);
  };

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      const { data } = await supabase.from('certificates').select('*').order('id', { ascending: false });
      if (!cancelled && data) setData(data);
    };

    void loadData();
    return () => { cancelled = true; };
  }, []);

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return setMessage("❌ Select a certificate image!");
    setLoading(true);
    
    try {
      const fileName = `cert_${Math.random()}.${file.name.split('.').pop()}`;
      const { error: uploadError } = await supabase.storage.from('koleksi-foto').upload(fileName, file);
      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage.from('koleksi-foto').getPublicUrl(fileName);
      const { error: insertError } = await supabase.from('certificates').insert([{ 
        ...form, image_url: urlData.publicUrl 
      }]);
      if (insertError) throw insertError;
      
      setMessage("✅ Certificate added!");
      setForm({ title: '', issuer: '', date: '', credential_id: '' });
      setFile(null);
      (document.getElementById('cert-upload') as HTMLInputElement).value = '';
      fetchData();
    } catch (err: unknown) {
      setMessage('❌ Failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this?")) return;
    await supabase.from('certificates').delete().eq('id', id);
    fetchData();
  };

  return (
    <div className="admin-manager grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
      <div className="xl:col-span-1 bg-white border rounded-xl p-6 h-fit">
        <h3 className="font-semibold mb-4">Add Certificate</h3>
        {message && <div className="mb-4 p-3 text-sm rounded-md border bg-gray-50">{message}</div>}
        <form onSubmit={handleUpload} className="flex flex-col gap-3">
          <input id="cert-upload" type="file" onChange={e => setFile(e.target.files?.[0] ?? null)} className="border p-1 rounded-md text-sm" required />
          <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="border p-2 rounded-md text-sm" placeholder="Certificate Title" required />
          <input type="text" value={form.issuer} onChange={e => setForm({...form, issuer: e.target.value})} className="border p-2 rounded-md text-sm" placeholder="Issuer (e.g. Coursera)" required />
          <input type="text" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="border p-2 rounded-md text-sm" placeholder="Date (e.g. Aug 2025)" required />
          <input type="text" value={form.credential_id} onChange={e => setForm({...form, credential_id: e.target.value})} className="border p-2 rounded-md text-sm" placeholder="Credential ID (Optional)" />
          <button type="submit" disabled={loading} className="bg-blue-600 text-white py-2 rounded-md text-sm mt-2">Upload Certificate</button>
        </form>
      </div>
      <div className="xl:col-span-2 bg-white border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50"><h3 className="text-xs font-bold text-gray-500 uppercase">Certificates List</h3></div>
        <div className="divide-y">
          {data.map(item => (
            <div key={item.id} className="p-5 flex gap-4 items-start">
              <img src={item.image_url} alt="" className="w-32 h-24 object-cover border rounded-md" />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.issuer}</p>
                <p className="text-xs text-gray-500 mt-1">{item.date} {item.credential_id && `• ID: ${item.credential_id}`}</p>
              </div>
              <button onClick={() => handleDelete(item.id)} className="px-3 py-1.5 bg-red-50 border border-red-100 text-red-600 text-xs rounded-md">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}