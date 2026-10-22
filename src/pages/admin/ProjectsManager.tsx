import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '../../../supabaseClient';
import type { ProjectItem } from './type';

const toJsonArray = (str: string) => JSON.stringify(str.split(',').map(s => s.trim()).filter(Boolean));
const fromJsonArray = (jsonStr: string) => { try { return JSON.parse(jsonStr).join(', '); } catch { return jsonStr; } };

export default function ProjectsManager() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // State Form
  const [projectFile, setProjectFile] = useState<File | null>(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectRoles, setProjectRoles] = useState('');
  const [projectTools, setProjectTools] = useState('');
  const [projectYear, setProjectYear] = useState(String(new Date().getFullYear()));
  const [projectLink, setProjectLink] = useState('');
  const [projectGithub, setProjectGithub] = useState('');
  const [projectFigma, setProjectFigma] = useState('');

  // State Edit
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<ProjectItem>>({});

  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('id', { ascending: false });
    if (data) setProjects(data);
  };

  useEffect(() => { 
    fetchProjects(); 
  }, []);

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!projectFile) return setMessage("❌ Please select a cover image!");
    setLoading(true); setMessage('⏳ Saving...');
    try {
      const fileExt = projectFile.name.split('.').pop();
      const fileName = `project_${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('koleksi-foto').upload(fileName, projectFile);
      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage.from('koleksi-foto').getPublicUrl(fileName);
      const { error: insertError } = await supabase.from('projects').insert([{
        title: projectTitle, description: projectDesc, image_url: urlData.publicUrl,
        roles: toJsonArray(projectRoles), tools: toJsonArray(projectTools), year: projectYear,
        link: projectLink || null, github_url: projectGithub || null, figma_url: projectFigma || null,
      }]);
      if (insertError) throw insertError;
      
      setMessage("✅ Project published!"); 
      setProjectFile(null); setProjectTitle(''); setProjectDesc(''); setProjectRoles(''); setProjectTools('');
      setProjectLink(''); setProjectGithub(''); setProjectFigma('');
      (document.getElementById('project-upload') as HTMLInputElement).value = '';
      fetchProjects();
    } catch (err: unknown) { 
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setMessage('❌ Failed: ' + msg); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this project?")) return;
    setLoading(true);
    await supabase.from('projects').delete().eq('id', id);
    fetchProjects(); setLoading(false);
  };

  const handleSaveEdit = async (id: number) => {
    setLoading(true);
    await supabase.from('projects').update({
      title: editForm.title, description: editForm.description,
      roles: toJsonArray(editForm.roles || ''), tools: toJsonArray(editForm.tools || ''),
      year: editForm.year, link: editForm.link || null, github_url: editForm.github_url || null, figma_url: editForm.figma_url || null,
    }).eq('id', id);
    setEditingId(null); fetchProjects(); setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* KIRI: Form */}
      <div className="xl:col-span-1 bg-white border rounded-xl shadow-sm p-6">
        <h3 className="text-base font-semibold mb-5 pb-3 border-b border-gray-100">Add New Project</h3>
        {message && <div className="mb-4 p-3 text-sm rounded-md border bg-gray-50">{message}</div>}
        <form onSubmit={handleUpload} className="flex flex-col gap-4">
          <input id="project-upload" type="file" onChange={e => setProjectFile(e.target.files?.[0] ?? null)} className="w-full text-sm border p-1 rounded-md" required />
          <input type="text" value={projectTitle} onChange={e => setProjectTitle(e.target.value)} className="border p-2.5 rounded-md text-sm" placeholder="Title" required />
          <textarea value={projectDesc} onChange={e => setProjectDesc(e.target.value)} className="border p-2.5 rounded-md text-sm h-20" placeholder="Description" required />
          <input type="text" value={projectRoles} onChange={e => setProjectRoles(e.target.value)} className="border p-2.5 rounded-md text-sm" placeholder="Roles (comma separated)" required />
          <input type="text" value={projectTools} onChange={e => setProjectTools(e.target.value)} className="border p-2.5 rounded-md text-sm" placeholder="Tools (comma separated)" required />
          <input type="text" value={projectYear} onChange={e => setProjectYear(e.target.value)} className="border p-2.5 rounded-md text-sm" placeholder="Year" required />
          <input type="url" value={projectLink} onChange={e => setProjectLink(e.target.value)} className="border p-2.5 rounded-md text-sm" placeholder="Demo URL (optional)" />
          <input type="url" value={projectGithub} onChange={e => setProjectGithub(e.target.value)} className="border p-2.5 rounded-md text-sm" placeholder="GitHub URL (optional)" />
          <input type="url" value={projectFigma} onChange={e => setProjectFigma(e.target.value)} className="border p-2.5 rounded-md text-sm" placeholder="Figma URL (optional)" />
          <button type="submit" disabled={loading} className="bg-blue-600 text-white py-2.5 rounded-md text-sm">Publish Project</button>
        </form>
      </div>

      {/* KANAN: List */}
      <div className="xl:col-span-2 bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50"><h3 className="text-xs font-bold text-gray-500 uppercase">Published Projects</h3></div>
        <div className="divide-y">
          {projects.map(proj => (
            <div key={proj.id} className="p-5 flex flex-col sm:flex-row gap-5 items-start">
              <img src={proj.image_url} className="w-full sm:w-28 h-20 rounded-lg object-cover border shrink-0" alt="" />
              <div className="flex-1 w-full space-y-2">
                {editingId === proj.id ? (
                  <div className="flex flex-col gap-2">
                    <input type="text" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} className="border p-2 text-sm" />
                    <textarea value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} className="border p-2 text-sm" />
                  </div>
                ) : (
                  <>
                    <h4 className="font-semibold text-gray-900">{proj.title}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{proj.description}</p>
                  </>
                )}
              </div>
              <div className="flex sm:flex-col gap-2 shrink-0">
                {editingId === proj.id ? (
                  <>
                    <button onClick={() => handleSaveEdit(proj.id)} className="px-4 py-2 bg-green-600 text-white text-xs rounded-md">Save</button>
                    <button onClick={() => setEditingId(null)} className="px-4 py-2 bg-white border text-gray-700 text-xs rounded-md">Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => {
                      setEditingId(proj.id);
                      setEditForm({ ...proj, roles: fromJsonArray(proj.roles), tools: fromJsonArray(proj.tools) });
                    }} className="px-4 py-2 bg-white border text-gray-700 text-xs rounded-md">Edit</button>
                    <button onClick={() => handleDelete(proj.id)} className="px-4 py-2 bg-white border border-red-200 text-red-600 text-xs rounded-md">Delete</button>
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