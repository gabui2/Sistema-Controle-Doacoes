import { useState } from 'react';
import { PROJECT_FILES } from '../data_sim';
import { FileItem } from '../types_sim';
import { FileCode, Database, Check, Copy, Terminal, ChevronRight, FileJson, Layers, Cpu, BookOpen, AlertCircle } from 'lucide-react';

export default function FileExplorer() {
  const [selectedFile, setSelectedFile] = useState<FileItem>(PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredFiles = PROJECT_FILES.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.path.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFileIcon = (iconName: string) => {
    switch (iconName) {
      case 'database': return <Database className="w-4 h-4 text-amber-500" />;
      case 'file-code': return <FileCode className="w-4 h-4 text-blue-500" />;
      default: return <FileCode className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="bg-slate-900 text-slate-100 rounded-xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col md:flex-row h-[700px]">
      {/* Sidebar - File Tree */}
      <div className="w-full md:w-64 border-r border-slate-800 flex flex-col bg-slate-950">
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold text-sm uppercase tracking-wider text-slate-300">Explorador de Código</span>
          </div>
          <input
            type="text"
            placeholder="Filtrar arquivos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-850 rounded-lg px-3 py-1.5 text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {/* Root Directory Marker */}
          <div className="text-[10px] uppercase font-bold text-slate-500 px-3 py-1 flex items-center gap-1">
            <Layers className="w-3 h-3" />
            <span>Sistema-Controle-Doacoes</span>
          </div>

          {filteredFiles.map((file) => {
            const isSelected = selectedFile.path === file.path;
            return (
              <button
                key={file.path}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between text-xs transition-all ${
                  isSelected 
                    ? 'bg-slate-800 text-white font-medium border-l-2 border-emerald-500' 
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  {getFileIcon(file.icon)}
                  <span className="truncate">{file.name}</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 opacity-0 transition-opacity ${isSelected ? 'opacity-100' : ''}`} />
              </button>
            );
          })}
        </div>
        
        <div className="p-3 bg-slate-900 border-t border-slate-800 text-[11px] text-slate-500 flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
          <span>Arquivos físicos reais criados no servidor. Pronto para exportar.</span>
        </div>
      </div>

      {/* Editor Panel */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-900">
        {/* Editor Tab Bar */}
        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <span className="bg-slate-900 px-2.5 py-1 rounded-md text-xs text-slate-400 font-mono truncate border border-slate-800">
              {selectedFile.path}
            </span>
          </div>
          
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-semibold shadow-md transition-all flex-shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado!' : 'Copiar Código'}</span>
          </button>
        </div>

        {/* Code Content Container */}
        <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed relative bg-slate-900">
          <pre className="text-emerald-400 select-all whitespace-pre-wrap md:whitespace-pre font-mono">
            {selectedFile.content}
          </pre>
        </div>
      </div>
    </div>
  );
}
