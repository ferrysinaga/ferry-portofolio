import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '../../supabaseClient';
import { motion } from 'framer-motion';
import type { Session } from '@supabase/supabase-js';

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
  roles: string;      // JSON string e.g. '["UI Designer","Developer"]'
  tools: string;      // JSON string e.g. '["Figma","React"]'
  year: string;
  link?: string;
  github_url?: string;
  figma_url?: string;
};

const Admin = () => {
  const [session, setSession] = useState<Session | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'gallery' | 'projects'>('gallery');

  // STATE GALLERY
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDesc, setEditDesc] = useState('');

  // STATE PROJECTS
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [projectFile, setProjectFile] = useState<File | null>(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectRoles, setProjectRoles] = useState('');   // comma-separated input
  const [projectTools, setProjectTools] = useState('');   // comma-separated input
  const [projectYear, setProjectYear] = useState(String(new Date().getFullYear()));
  const [projectLink, setProjectLink] = useState('');
  const [projectGithub, setProjectGithub] = useState('');
  const [projectFigma, setProjectFigma] = useState('');

  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [editProjectTitle, setEditProjectTitle] = useState('');
  const [editProjectDesc, setEditProjectDesc] = useState('');
  const [editProjectRoles, setEditProjectRoles] = useState('');
  const [editProjectTools, setEditProjectTools] = useState('');
  const [editProjectYear, setEditProjectYear] = useState('');
  const [editProjectLink, setEditProjectLink] = useState('');
  const [editProjectGithub, setEditProjectGithub] = useState('');
  const [editProjectFigma, setEditProjectFigma] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
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

  useEffect(() => {
    if (!session) return;
    const loadData = async () => {
      await fetchPhotos();
      await fetchProjects();
    };
    void loadData();
  }, [session]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true); setMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage("❌ Invalid email or password.");
    setLoading(false);
  };

  const handleLogout = async () => await supabase.auth.signOut();

  // Helper: parse comma-separated → JSON array string
  const toJsonArray = (str: string) =>
    JSON.stringify(str.split(',').map(s => s.trim()).filter(Boolean));

  // Helper: parse JSON array string → comma-separated display
  const fromJsonArray = (jsonStr: string) => {
    try { return JSON.parse(jsonStr).join(', '); }
    catch { return jsonStr; }
  };

  // ===================== FUNGSI GALLERY =====================
  const handleUploadPhoto = async (e: FormEvent) => {
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
      fetchPhotos();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setMessage('❌ Failed: ' + msg);
    }
    finally { setLoading(false); }
  };

  const handleDeletePhoto = async (id: number) => {
    if (!window.confirm("Delete this photo?")) return;
    setLoading(true);
    const { error } = await supabase.from('gallery').delete().eq('id', id);
    if (error) setMessage("❌ Failed to delete.");
    else { setMessage("✅ Photo deleted!"); fetchPhotos(); }
    setLoading(false);
  };

  const handleSaveEditPhoto = async (id: number) => {
    setLoading(true);
    const { error } = await supabase.from('gallery').update({ description: editDesc }).eq('id', id);
    if (error) setMessage("❌ Failed to update.");
    else { setMessage("✅ Updated!"); setEditingId(null); fetchPhotos(); }
    setLoading(false);
  };

  // ===================== FUNGSI PROJECTS =====================
  const handleUploadProject = async (e: FormEvent) => {
    e.preventDefault();
    if (!projectFile) return setMessage("❌ Please select a cover image!");
    setLoading(true); setMessage('⏳ Saving project...');
    try {
      const fileExt = projectFile.name.split('.').pop();
      const fileName = `project_${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('koleksi-foto').upload(fileName, projectFile);
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from('koleksi-foto').getPublicUrl(fileName);
      const { error: insertError } = await supabase.from('projects').insert([{
        title: projectTitle,
        description: projectDesc,
        image_url: urlData.publicUrl,
        roles: toJsonArray(projectRoles),
        tools: toJsonArray(projectTools),
        year: projectYear,
        link: projectLink || null,
        github_url: projectGithub || null,
        figma_url: projectFigma || null,
      }]);
      if (insertError) throw insertError;
      setMessage("✅ Project published!");
      setProjectFile(null); setProjectTitle(''); setProjectDesc('');
      setProjectRoles(''); setProjectTools(''); setProjectYear(String(new Date().getFullYear()));
      setProjectLink(''); setProjectGithub(''); setProjectFigma('');
      (document.getElementById('project-upload') as HTMLInputElement).value = '';
      fetchProjects();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setMessage('❌ Failed: ' + msg);
    }
    finally { setLoading(false); }
  };

  const handleDeleteProject = async (id: number) => {
    if (!window.confirm("Delete this project?")) return;
    setLoading(true);
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) setMessage("❌ Failed to delete.");
    else { setMessage("✅ Project deleted!"); fetchProjects(); }
    setLoading(false);
  };

  const handleSaveEditProject = async (id: number) => {
    setLoading(true);
    const { error } = await supabase.from('projects').update({
      title: editProjectTitle,
      description: editProjectDesc,
      roles: toJsonArray(editProjectRoles),
      tools: toJsonArray(editProjectTools),
      year: editProjectYear,
      link: editProjectLink || null,
      github_url: editProjectGithub || null,
      figma_url: editProjectFigma || null,
    }).eq('id', id);
    if (error) setMessage("❌ Failed to update.");
    else { setMessage("✅ Project updated!"); setEditingProjectId(null); fetchProjects(); }
    setLoading(false);
  };

  // ================= LOGIN =================
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
            <p className="text-sm text-gray-500 mt-2">Sign in to manage your portfolio</p>
          </div>
          {message && <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-md text-center">{message}</div>}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm" required />
            </div>
            <button type="submit" disabled={loading} className="w-full mt-2 bg-blue-600 text-white p-2.5 rounded-md font-medium hover:bg-blue-700 transition-colors text-sm">
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // ================= DASHBOARD =================
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">

      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Admin<span className="text-blue-600">Panel</span></h1>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <button onClick={() => { setActiveTab('gallery'); setMessage(''); }} className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'gallery' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
            📸 Gallery
          </button>
          <button onClick={() => { setActiveTab('projects'); setMessage(''); }} className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'projects' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
            🚀 Projects
          </button>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
              {session.user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate">{session.user?.email}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full py-2 px-4 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">{activeTab === 'gallery' ? 'Gallery Management' : 'Projects Management'}</h2>
            <p className="text-sm text-gray-500 mt-1">{activeTab === 'gallery' ? 'Upload and manage photos.' : 'Add and edit projects to showcase your work.'}</p>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-md border text-sm font-medium ${message.includes('❌') ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

            {/* FORM KOLOM KIRI */}
            <div className="xl:col-span-1">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">
                  {activeTab === 'gallery' ? 'Add New Photo' : 'Add New Project'}
                </h3>

                {activeTab === 'gallery' ? (
                  <form onSubmit={handleUploadPhoto} className="flex flex-col gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image File</label>
                      <input id="file-upload" type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] ?? null)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-300 rounded-md p-1" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm h-20 resize-none" placeholder="A brief description..." required />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2.5 rounded-md font-medium hover:bg-blue-700 transition-colors text-sm">
                      {loading ? 'Processing...' : 'Upload Photo'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleUploadProject} className="flex flex-col gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
                      <input id="project-upload" type="file" accept="image/*" onChange={e => setProjectFile(e.target.files?.[0] ?? null)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-300 rounded-md p-1" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input type="text" value={projectTitle} onChange={e => setProjectTitle(e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="E-Commerce App" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea value={projectDesc} onChange={e => setProjectDesc(e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm h-20 resize-none" placeholder="Built with React and Supabase..." required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Roles <span className="text-gray-400 font-normal">(comma separated)</span></label>
                      <input type="text" value={projectRoles} onChange={e => setProjectRoles(e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="UI Designer, Developer" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tools <span className="text-gray-400 font-normal">(comma separated)</span></label>
                      <input type="text" value={projectTools} onChange={e => setProjectTools(e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Figma, React, Tailwind" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                      <input type="text" value={projectYear} onChange={e => setProjectYear(e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="2025" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Live Demo URL <span className="text-gray-400 font-normal">(optional)</span></label>
                      <input type="url" value={projectLink} onChange={e => setProjectLink(e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="https://..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL <span className="text-gray-400 font-normal">(optional)</span></label>
                      <input type="url" value={projectGithub} onChange={e => setProjectGithub(e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="https://github.com/..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Figma URL <span className="text-gray-400 font-normal">(optional)</span></label>
                      <input type="url" value={projectFigma} onChange={e => setProjectFigma(e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="https://figma.com/..." />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2.5 rounded-md font-medium hover:bg-blue-700 transition-colors text-sm mt-2">
                      {loading ? 'Processing...' : 'Publish Project'}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* LIST KOLOM KANAN */}
            <div className="xl:col-span-2">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {activeTab === 'gallery' ? 'Uploaded Photos' : 'Published Projects'}
                  </h3>
                </div>

                <div className="divide-y divide-gray-100">

                  {/* GALLERY LIST */}
                  {activeTab === 'gallery' && (
                    photos.length === 0 ? (
                      <div className="p-8 text-center text-gray-500 text-sm">No photos found.</div>
                    ) : photos.map(photo => (
                      <div key={photo.id} className="p-5 flex flex-col sm:flex-row gap-5 items-start hover:bg-slate-50 transition-colors">
                        <img src={photo.image_url} alt="" className="w-full sm:w-24 h-24 rounded-lg object-cover border border-gray-200 shrink-0" />
                        <div className="flex-1 w-full">
                          {editingId === photo.id ? (
                            <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm h-20 mb-2" autoFocus />
                          ) : (
                            <p className="text-sm text-gray-800">{photo.description}</p>
                          )}
                          <p className="text-xs text-gray-400 mt-2 font-mono">ID: {photo.id}</p>
                        </div>
                        <div className="flex sm:flex-col gap-2 shrink-0">
                          {editingId === photo.id ? (
                            <>
                              <button onClick={() => handleSaveEditPhoto(photo.id)} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-md transition-colors">Save</button>
                              <button onClick={() => setEditingId(null)} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-xs font-medium rounded-md hover:bg-gray-50 transition-colors">Cancel</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => { setEditingId(photo.id); setEditDesc(photo.description); }} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-xs font-medium rounded-md hover:bg-gray-50 transition-colors">Edit</button>
                              <button onClick={() => handleDeletePhoto(photo.id)} className="px-4 py-2 bg-white border border-red-200 text-red-600 text-xs font-medium rounded-md hover:bg-red-50 transition-colors">Delete</button>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  )}

                  {/* PROJECTS LIST */}
                  {activeTab === 'projects' && (
                    projects.length === 0 ? (
                      <div className="p-8 text-center text-gray-500 text-sm">No projects found.</div>
                    ) : projects.map(proj => (
                      <div key={proj.id} className="p-5 flex flex-col sm:flex-row gap-5 items-start hover:bg-slate-50 transition-colors">
                        <img src={proj.image_url} alt="" className="w-full sm:w-28 h-20 rounded-lg object-cover border border-gray-200 shrink-0" />
                        <div className="flex-1 w-full space-y-2">
                          {editingProjectId === proj.id ? (
                            <>
                              <input type="text" value={editProjectTitle} onChange={e => setEditProjectTitle(e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold" placeholder="Title" />
                              <textarea value={editProjectDesc} onChange={e => setEditProjectDesc(e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm h-16 resize-none" placeholder="Description" />
                              <input type="text" value={editProjectRoles} onChange={e => setEditProjectRoles(e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Roles (comma separated)" />
                              <input type="text" value={editProjectTools} onChange={e => setEditProjectTools(e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Tools (comma separated)" />
                              <input type="text" value={editProjectYear} onChange={e => setEditProjectYear(e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Year" />
                              <input type="url" value={editProjectLink} onChange={e => setEditProjectLink(e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Demo URL" />
                              <input type="url" value={editProjectGithub} onChange={e => setEditProjectGithub(e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="GitHub URL" />
                              <input type="url" value={editProjectFigma} onChange={e => setEditProjectFigma(e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Figma URL" />
                            </>
                          ) : (
                            <>
                              <h4 className="text-base font-semibold text-gray-900">{proj.title}</h4>
                              <p className="text-sm text-gray-600 line-clamp-2">{proj.description}</p>
                              <div className="flex flex-wrap gap-1 pt-1">
                                {(() => { try { return JSON.parse(proj.roles || '[]'); } catch { return []; } })().map((r: string, i: number) => (
                                  <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-md font-medium">{r}</span>
                                ))}
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {(() => { try { return JSON.parse(proj.tools || '[]'); } catch { return []; } })().map((t: string, i: number) => (
                                  <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md">{t}</span>
                                ))}
                              </div>
                              <p className="text-xs text-gray-400">{proj.year}</p>
                            </>
                          )}
                        </div>
                        <div className="flex sm:flex-col gap-2 shrink-0">
                          {editingProjectId === proj.id ? (
                            <>
                              <button onClick={() => handleSaveEditProject(proj.id)} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-md transition-colors">Save</button>
                              <button onClick={() => setEditingProjectId(null)} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-xs font-medium rounded-md hover:bg-gray-50 transition-colors">Cancel</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => {
                                setEditingProjectId(proj.id);
                                setEditProjectTitle(proj.title);
                                setEditProjectDesc(proj.description);
                                setEditProjectRoles(fromJsonArray(proj.roles));
                                setEditProjectTools(fromJsonArray(proj.tools));
                                setEditProjectYear(proj.year);
                                setEditProjectLink(proj.link || '');
                                setEditProjectGithub(proj.github_url || '');
                                setEditProjectFigma(proj.figma_url || '');
                              }} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-xs font-medium rounded-md hover:bg-gray-50 transition-colors">Edit</button>
                              <button onClick={() => handleDeleteProject(proj.id)} className="px-4 py-2 bg-white border border-red-200 text-red-600 text-xs font-medium rounded-md hover:bg-red-50 transition-colors">Delete</button>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  )}

                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </motion.div>
  );
};

export default Admin;