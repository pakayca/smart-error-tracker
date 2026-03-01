'use client';
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import ReactMarkdown from 'react-markdown';
import { Terminal, AlertCircle, CheckCircle2, Plus, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const [errors, setErrors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchErrors = async () => {
    const { data } = await supabase.from('error_groups').select('*').order('created_at', { ascending: false });
    if (data) setErrors(data);
  };

  useEffect(() => { fetchErrors(); }, []);

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'open' ? 'resolved' : 'open';
    await supabase.from('error_groups').update({ status: newStatus }).eq('id', id);
    fetchErrors();
  };

  const sendTestError = async () => {
    setLoading(true);
    const now = new Date().toLocaleTimeString();
    await fetch('/api/report', {
      method: 'POST',
      body: JSON.stringify({
        message: `ReferenceError: config is not defined at ${now}`,
        stack: "at Object.<anonymous> (index.js:5:1)",
        metadata: { env: "dev" }
      }),
    });
    setTimeout(() => { fetchErrors(); setLoading(false); }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0f1115] text-zinc-200 p-8 font-sans selection:bg-indigo-500/30">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-10 border-b border-zinc-800/50 pb-8">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
              <Terminal className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white uppercase">
              Smart Error Tracker
            </h1>
          </div>
          <button 
            onClick={sendTestError} 
            disabled={loading} 
            className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-indigo-600/10 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Simulate Crash'}
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </header>

        {/* Counter Cards */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <StatCard title="Total Events" value={errors.length} color="text-zinc-400" />
          <StatCard title="Open Issues" value={errors.filter(e => e.status === 'open').length} color="text-rose-500" />
          <StatCard title="Resolved" value={errors.filter(e => e.status === 'resolved').length} color="text-emerald-400" />
        </div>

        {/* List Section */}
        <div className="space-y-6">
          {errors.map((error) => (
            <div key={error.id} className={`border ${error.status === 'resolved' ? 'border-zinc-800/50 bg-zinc-900/10' : 'border-zinc-800 bg-[#16191f]'} rounded-xl p-6 transition-all hover:border-zinc-700`}>
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter ${error.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-500'}`}>
                      {error.status}
                    </span>
                    <h2 className="text-base font-mono font-semibold text-white">{error.message}</h2>
                  </div>
                  <p className="text-[11px] text-zinc-500 font-medium pl-14">
                    Detected at {new Date(error.created_at).toLocaleString()}
                  </p>
                </div>
                <button 
                  onClick={() => toggleStatus(error.id, error.status)} 
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${error.status === 'resolved' ? 'text-zinc-500 hover:text-white' : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'}`}
                >
                  {error.status === 'resolved' ? 'Re-open' : 'Mark Resolved'}
                </button>
              </div>

              {/* AI Diagnostic section - Contrast is key here */}
              <div className="bg-[#0c0e12] rounded-lg p-5 border border-zinc-800/50">
                <div className="flex items-center gap-2 mb-4">
                  <div className="size-1.5 bg-indigo-500 rounded-full" />
                  <span className="text-[10px] font-bold tracking-widest uppercase text-indigo-400">AI Diagnostic Engine</span>
                </div>
                <div className="prose prose-invert prose-sm max-w-none text-zinc-300 leading-relaxed font-normal">
                  <ReactMarkdown>{error.ai_suggestion}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}

          {errors.length === 0 && (
            <div className="py-24 text-center border-2 border-dashed border-zinc-800/50 rounded-2xl">
              <p className="text-sm text-zinc-600 font-medium uppercase tracking-widest">Waiting for incoming telemetry...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }: any) {
  return (
    <div className="bg-[#16191f] border border-zinc-800 p-5 rounded-xl">
      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">{title}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}