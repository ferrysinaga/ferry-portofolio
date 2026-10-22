import { useState } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '../../../supabaseClient';
import type { Session } from '@supabase/supabase-js';

export default function ProfileManager({ session }: { session: Session }) {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpdatePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      return setMessage("❌ Password must be at least 6 characters.");
    }

    setLoading(true); setMessage('⏳ Updating password...');
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    
    if (error) {
      setMessage("❌ Failed: " + error.message);
    } else {
      setMessage("✅ Password updated successfully!");
      setNewPassword('');
    }
    setLoading(false);
  };

  const inputClass = "w-full border-2 border-[#1d1d1d] p-3 text-[#1d1d1d] text-sm focus:outline-none focus:translate-x-[-3px] focus:translate-y-[-3px] focus:shadow-[4px_4px_0px_0px_#1d1d1d] transition-all rounded-none";
  const btnClass = "bg-[#1d1d1d] text-white px-6 py-3 font-bold border-2 border-[#1d1d1d] shadow-[4px_4px_0px_0px_#e5e7eb] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-300 rounded-none uppercase tracking-wider mt-2";

  return (
    <div className="bg-white border-4 border-[#1d1d1d] shadow-[8px_8px_0px_0px_#1d1d1d] p-8 max-w-2xl">
      <h3 className="text-2xl font-bold text-[#1d1d1d] uppercase tracking-widest border-b-4 border-[#1d1d1d] inline-block pb-1 mb-6">Profile Settings</h3>
      
      <div className="mb-8">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Registered Email</label>
        <div className="border-2 border-gray-200 bg-gray-50 p-3 text-[#1d1d1d] font-bold text-sm cursor-not-allowed">
          {session.user?.email}
        </div>
        <p className="text-xs text-gray-400 mt-2">* Email cannot be changed directly for security reasons.</p>
      </div>

      <div className="border-t-4 border-dashed border-gray-200 pt-8">
        <h4 className="text-lg font-bold text-[#1d1d1d] mb-4 uppercase">Change Password</h4>
        {message && <div className={`mb-4 p-3 border-2 border-[#1d1d1d] text-sm font-bold shadow-[3px_3px_0px_0px_#1d1d1d] ${message.includes('❌') ? 'bg-red-100' : 'bg-green-100'}`}>{message}</div>}
        
        <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">New Password</label>
            <input 
              type="password" 
              value={newPassword} 
              onChange={e => setNewPassword(e.target.value)} 
              className={inputClass} 
              placeholder="ENTER NEW PASSWORD" 
              required 
            />
          </div>
          <button type="submit" disabled={loading} className={btnClass}>
            {loading ? 'PROCESSING...' : 'UPDATE PASSWORD'}
          </button>
        </form>
      </div>
    </div>
  );
}