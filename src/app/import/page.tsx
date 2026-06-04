'use client';

import { useState } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      
      Papa.parse(selectedFile, {
        header: true,
        preview: 5,
        skipEmptyLines: true,
        complete: (results) => {
          setPreview(results.data);
        }
      });
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/import/csv', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Failed to upload and parse the file.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Import Salaries from CSV</h1>
      <p className="text-zinc-400 mb-8">Bulk upload compensation data for your organization or the community.</p>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-8">
        <h2 className="text-lg font-semibold mb-4">CSV Format Requirements</h2>
        <p className="text-sm text-zinc-400 mb-4">Your CSV must contain a header row with the exact column names below. Empty rows are skipped.</p>
        
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 font-mono text-sm text-zinc-300 overflow-x-auto whitespace-nowrap mb-8">
          company,role,level,location,base,bonus,equity,yoe<br/>
          Google,Software Engineer,L4,Bangalore,35,5,15,3<br/>
          Flipkart,SDE2,SDE2,Bangalore,28,2.8,8,3
        </div>

        <div className="border-2 border-dashed border-zinc-700 hover:border-indigo-500 transition-colors rounded-xl p-12 text-center cursor-pointer relative bg-zinc-900/50">
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileChange} 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <UploadCloud className="mx-auto text-zinc-500 mb-4" size={48} />
          <h3 className="text-lg font-medium text-white mb-1">Click or drag CSV here</h3>
          <p className="text-zinc-400 text-sm">{file ? file.name : 'Max file size 5MB'}</p>
        </div>
      </div>

      {preview.length > 0 && !result && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-8 animate-in fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Data Preview (First 5 rows)</h2>
            <button 
              onClick={handleUpload} 
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? 'Processing...' : 'Start Import'}
            </button>
          </div>
          
          <div className="overflow-x-auto rounded-lg border border-zinc-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-950 text-zinc-400">
                <tr>
                  {Object.keys(preview[0] || {}).map(key => (
                    <th key={key} className="px-4 py-2 font-medium">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {preview.map((row, i) => (
                  <tr key={i} className="bg-zinc-900">
                    {Object.values(row).map((val: any, j) => (
                      <td key={j} className="px-4 py-2 text-zinc-300">{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {result && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 animate-in zoom-in-95">
          {result.error ? (
            <div className="text-center">
              <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
              <h2 className="text-xl font-bold text-red-400 mb-2">Import Failed</h2>
              <p className="text-zinc-400">{result.error}</p>
            </div>
          ) : (
            <div>
              <div className="text-center mb-8">
                <CheckCircle2 className="mx-auto text-emerald-500 mb-4" size={48} />
                <h2 className="text-2xl font-bold text-white mb-2">Import Complete</h2>
                <div className="flex justify-center gap-8 mt-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-400">{result.imported || 0}</div>
                    <div className="text-sm text-zinc-500 uppercase">Imported</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-400">{result.failed || 0}</div>
                    <div className="text-sm text-zinc-500 uppercase">Failed</div>
                  </div>
                </div>
              </div>

              {result.errors && result.errors.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-4 text-red-400">Errors Log:</h3>
                  <div className="bg-zinc-950 p-4 rounded-lg font-mono text-sm text-zinc-400 h-48 overflow-y-auto">
                    {result.errors.map((err: string, i: number) => (
                      <div key={i} className="mb-1 border-b border-zinc-800/50 pb-1">{err}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
