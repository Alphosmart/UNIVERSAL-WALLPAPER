import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SummaryApi from '../common';
import { setUserDetails } from '../store/userSlice';

const ChangeRequiredPassword = () => {
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const submit = async (event) => {
    event.preventDefault();
    if (form.password.length < 8) return toast.error('Password must be at least 8 characters');
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      const response = await fetch(SummaryApi.changeRequiredPassword.url, { method: 'put', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ newPassword: form.password }) });
      const result = await response.json();
      if (!result.success) return toast.error(result.message);
      const current = await fetch(SummaryApi.current_user.url, { credentials: 'include' });
      const currentResult = await current.json();
      if (currentResult.success) dispatch(setUserDetails(currentResult.data));
      toast.success('Password changed successfully');
      navigate('/', { replace: true });
    } catch (_) { toast.error('Unable to change password'); }
    finally { setLoading(false); }
  };
  return <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 px-4"><form onSubmit={submit} className="w-full max-w-md space-y-5 rounded-xl bg-white p-8 shadow-lg"><div><h1 className="text-2xl font-bold text-gray-900">Create a new password</h1><p className="mt-2 text-sm text-gray-600">Your administrator issued a temporary password. Replace it before continuing.</p></div><div><label className="mb-1 block text-sm font-medium">New password</label><input type="password" autoComplete="new-password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} className="w-full rounded-md border px-3 py-2" required /></div><div><label className="mb-1 block text-sm font-medium">Confirm new password</label><input type="password" autoComplete="new-password" value={form.confirm} onChange={(e)=>setForm({...form,confirm:e.target.value})} className="w-full rounded-md border px-3 py-2" required /></div><button disabled={loading} className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-50">{loading ? 'Changing…' : 'Change password and continue'}</button></form></section>;
};
export default ChangeRequiredPassword;
