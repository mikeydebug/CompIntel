'use client';

import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ChevronRight, AlertTriangle } from 'lucide-react';
import { formatTC } from '@/lib/format';

export default function SubmitPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    role: '',
    internalLevel: '',
    location: '',
    baseSalary: '',
    bonus: '',
    equity: '',
    yearsExp: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (status === 'loading') {
    return <div className="p-20 text-center animate-pulse">Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return (
      <div className="container mx-auto px-4 py-20 max-w-md text-center">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          <AlertTriangle className="mx-auto text-amber-500 mb-6" size={48} />
          <h1 className="text-2xl font-bold mb-4">Sign in required</h1>
          <p className="text-zinc-400 mb-8">
            You must be signed in to submit a salary entry. Your identity is always kept strictly anonymous and is only used to prevent spam.
          </p>
          <button
            onClick={() => signIn('google')}
            className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition-colors"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.companyName || !formData.role || !formData.internalLevel) {
        setError('Please fill in all fields to continue.');
        return;
      }
    }
    if (step === 2) {
      if (!formData.baseSalary) {
        setError('Base salary is required.');
        return;
      }
    }
    setStep(step + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.location || !formData.yearsExp) {
      setError('Please fill in all fields.');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const payload = {
        companyName: formData.companyName,
        role: formData.role,
        internalLevel: formData.internalLevel,
        location: formData.location,
        baseSalary: parseFloat(formData.baseSalary),
        bonus: parseFloat(formData.bonus || '0'),
        equity: parseFloat(formData.equity || '0'),
        yearsExp: parseFloat(formData.yearsExp)
      };

      const res = await fetch('/api/salaries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to submit');
      }

      setStep(4); // Success step
      setTimeout(() => {
        router.push(`/companies/${json.data.company.slug}`);
      }, 3000);

    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const computedTC = parseFloat(formData.baseSalary || '0') + parseFloat(formData.bonus || '0') + parseFloat(formData.equity || '0');

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Contribute Salary</h1>
        <p className="text-zinc-400">Help the community by sharing your compensation anonymously.</p>
      </div>

      <div className="flex items-center gap-2 mb-10 text-sm font-medium">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}>1</div>
        <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-indigo-600' : 'bg-zinc-800'}`}></div>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}>2</div>
        <div className={`h-1 flex-1 rounded-full ${step >= 3 ? 'bg-indigo-600' : 'bg-zinc-800'}`}></div>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}>3</div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-10 shadow-2xl">
        {error && <div className="mb-6 p-4 bg-red-900/30 border border-red-800 text-red-400 rounded-lg text-sm">{error}</div>}

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-xl font-bold">Role Details</h2>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Company Name</label>
              <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 focus:ring-1 focus:ring-indigo-500" placeholder="e.g. Google, Flipkart" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Role</label>
              <input type="text" name="role" value={formData.role} onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 focus:ring-1 focus:ring-indigo-500" placeholder="e.g. Software Engineer" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Internal Level</label>
              <input type="text" name="internalLevel" value={formData.internalLevel} onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 focus:ring-1 focus:ring-indigo-500" placeholder="e.g. SDE-2, L4, E5" />
            </div>
            <button onClick={nextStep} className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors mt-8">
              Continue <ChevronRight size={18} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Compensation (in INR LPA)</h2>
              <button onClick={() => setStep(1)} className="text-sm text-zinc-500 hover:text-white">Back</button>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Base Salary (LPA)</label>
              <input type="number" step="0.1" name="baseSalary" value={formData.baseSalary} onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 focus:ring-1 focus:ring-indigo-500" placeholder="e.g. 24.5" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Bonus (LPA)</label>
              <input type="number" step="0.1" name="bonus" value={formData.bonus} onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 focus:ring-1 focus:ring-indigo-500" placeholder="e.g. 2.5" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Annualized Equity (LPA)</label>
              <input type="number" step="0.1" name="equity" value={formData.equity} onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 focus:ring-1 focus:ring-indigo-500" placeholder="e.g. 10.0" />
            </div>
            
            <div className="mt-8 p-6 bg-zinc-950 border border-zinc-800 rounded-xl text-center">
              <div className="text-sm text-zinc-500 uppercase tracking-wider mb-2">Calculated Total Comp</div>
              <div className="text-4xl font-bold text-emerald-400">{formatTC(computedTC)}</div>
            </div>

            <button onClick={nextStep} className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors mt-8">
              Continue <ChevronRight size={18} />
            </button>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Final Details</h2>
              <button type="button" onClick={() => setStep(2)} className="text-sm text-zinc-500 hover:text-white">Back</button>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 focus:ring-1 focus:ring-indigo-500" placeholder="e.g. Bangalore, Remote" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Years of Experience</label>
              <input type="number" step="0.5" name="yearsExp" value={formData.yearsExp} onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 focus:ring-1 focus:ring-indigo-500" placeholder="e.g. 3.5" />
            </div>
            
            <div className="text-xs text-zinc-500 mt-6 pt-6 border-t border-zinc-800">
              By submitting, you confirm this information is accurate to the best of your knowledge. Your data will be aggregated anonymously.
            </div>

            <button disabled={loading} type="submit" className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors mt-8 disabled:opacity-50">
              {loading ? 'Submitting...' : 'Submit Salary'}
            </button>
          </form>
        )}

        {step === 4 && (
          <div className="text-center py-12 animate-in zoom-in-95">
            <CheckCircle2 className="mx-auto text-emerald-500 mb-6" size={64} />
            <h2 className="text-3xl font-bold mb-4">Thank You!</h2>
            <p className="text-zinc-400 mb-8">Your salary has been successfully added to the database. You are being redirected to the company page...</p>
          </div>
        )}
      </div>
    </div>
  );
}
