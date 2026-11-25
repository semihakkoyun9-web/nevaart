import React, { useState } from 'react';
import { PHP_PROJECT_FILES, PhpFileItem } from '../data/phpProjectFiles';
import { translations } from '../data/i18n';
import { 
  X, Copy, Check, Download, FileCode, Server, Terminal, 
  ExternalLink, Sparkles, FolderTree, CheckCircle2, Play
} from 'lucide-react';

interface PhpSourceCodeModalProps {
  currentLang: 'tr' | 'en';
  onClose: () => void;
}

export const PhpSourceCodeModal: React.FC<PhpSourceCodeModalProps> = ({
  currentLang,
  onClose,
}) => {
  const t = translations[currentLang];
  const [selectedWeek, setSelectedWeek] = useState<number | 'all'>('all');
  const [selectedFile, setSelectedFile] = useState<PhpFileItem>(PHP_PROJECT_FILES[0]);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedPath, setCopiedPath] = useState(false);

  const filteredFiles = selectedWeek === 'all' 
    ? PHP_PROJECT_FILES 
    : PHP_PROJECT_FILES.filter(f => f.week === selectedWeek);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyPath = () => {
    navigator.clipboard.writeText(selectedFile.path);
    setCopiedPath(true);
    setTimeout(() => setCopiedPath(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([selectedFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="relative bg-[#0F1117] border border-stone-800 w-full max-w-7xl max-h-[94vh] overflow-hidden shadow-2xl rounded-xl flex flex-col text-stone-200">
        
        {/* Header Bar */}
        <div className="bg-[#161922] border-b border-stone-800 px-5 sm:px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                  İnternet Programcılığı II
                </span>
                <span className="text-xs text-stone-400 font-mono hidden sm:inline">
                  Dr. Ahmet Akkaya · Gönen MYO (2026–2027)
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
                PHP & XAMPP Backend Kod Altyapısı
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white hover:bg-stone-800/80 rounded-lg transition-colors cursor-pointer"
            title={t.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* XAMPP Environment & Filter Strip */}
        <div className="bg-[#12141C] border-b border-stone-800/80 px-5 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Module Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setSelectedWeek('all')}
              className={`px-3 py-1 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
                selectedWeek === 'all'
                  ? 'bg-amber-500 text-black font-semibold shadow-xs'
                  : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700'
              }`}
            >
              Tüm Kod Dosyaları ({PHP_PROJECT_FILES.length})
            </button>
            <button
              onClick={() => setSelectedWeek(1)}
              className={`px-3 py-1 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
                selectedWeek === 1
                  ? 'bg-blue-500 text-white font-semibold shadow-xs'
                  : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700'
              }`}
            >
              Web Mimarisi & XAMPP
            </button>
            <button
              onClick={() => setSelectedWeek(2)}
              className={`px-3 py-1 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
                selectedWeek === 2
                  ? 'bg-emerald-500 text-white font-semibold shadow-xs'
                  : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700'
              }`}
            >
              PHP Değişkenler & Operatörler
            </button>
            <button
              onClick={() => setSelectedWeek(3)}
              className={`px-3 py-1 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
                selectedWeek === 3
                  ? 'bg-purple-500 text-white font-semibold shadow-xs'
                  : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700'
              }`}
            >
              Karar Yapıları, switch & match
            </button>
          </div>

          {/* Quick Notice */}
          <div className="flex items-center gap-2 font-mono text-[11px] text-stone-400">
            <Server className="w-3.5 h-3.5 text-amber-400" />
            <span>Hedef Dizin: <strong className="text-stone-200">C:\xampp\htdocs\internet2\</strong></span>
          </div>
        </div>

        {/* Main Workspace: Left Explorer / Right Code + Output */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* File Explorer Sidebar */}
          <div className="w-full md:w-80 bg-[#12141C] border-r border-stone-800/80 overflow-y-auto p-4 shrink-0 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-semibold flex items-center gap-1.5">
                <FolderTree className="w-3.5 h-3.5 text-amber-400" />
                Müfredat Dosyaları
              </span>
              <span className="text-[10px] font-mono text-stone-500">
                {filteredFiles.length} dosya
              </span>
            </div>

            <div className="space-y-1.5 flex-1">
              {filteredFiles.map((file) => {
                const isSelected = selectedFile.name === file.name;
                const weekBadgeColor = 
                  file.week === 1 ? 'border-blue-500/40 text-blue-400 bg-blue-500/10' :
                  file.week === 2 ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' :
                  'border-purple-500/40 text-purple-400 bg-purple-500/10';

                return (
                  <button
                    key={file.name}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left p-2.5 rounded-lg text-xs font-mono transition-all flex items-start gap-2.5 cursor-pointer border ${
                      isSelected
                        ? 'bg-stone-800/90 text-white border-amber-500/50 shadow-md ring-1 ring-amber-500/30'
                        : 'bg-stone-900/40 text-stone-300 border-stone-800/60 hover:bg-stone-800/50 hover:text-white'
                    }`}
                  >
                    <FileCode className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-amber-400' : 'text-stone-400'}`} />
                    <div className="truncate flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold truncate text-[12px]">{file.name}</span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded border font-sans uppercase shrink-0 ${weekBadgeColor}`}>
                          Hafta {file.week}
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-400 font-sans block truncate mt-0.5">
                        {file.category}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Principles from Slides */}
            <div className="mt-4 pt-4 border-t border-stone-800/80 text-[11px] text-stone-400 space-y-1.5 font-sans bg-stone-900/30 p-3 rounded-lg border border-stone-800/60">
              <span className="font-mono text-[10px] uppercase font-bold text-amber-400 block mb-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Ders Kuralları & Söz Dizimi:
              </span>
              <p className="flex items-start gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" />
                <span>Noktalı virgül (;) unutulmamalı.</span>
              </p>
              <p className="flex items-start gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" />
                <span>Değişkenler büyük/küçük harfe duyarlıdır ($ad != $Ad).</span>
              </p>
              <p className="flex items-start gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" />
                <span>Tek tırnakta metin düz kalır, çift tırnakta değişken işlenir.</span>
              </p>
              <p className="flex items-start gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" />
                <span>elseif zincirinde ilk true dal çalışır, sıra çok önemlidir.</span>
              </p>
              <p className="flex items-start gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" />
                <span>PHP 8+ match ifadesi strict (===) kontrolü yapar.</span>
              </p>
            </div>
          </div>

          {/* Right Code Display & Output Simulation */}
          <div className="flex-1 flex flex-col bg-[#0B0C10] overflow-hidden">
            
            {/* Code Toolbar */}
            <div className="bg-[#14161F] border-b border-stone-800 px-5 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 text-xs font-mono">
                <button
                  onClick={handleCopyPath}
                  className="text-stone-300 hover:text-white flex items-center gap-1 bg-stone-800/80 px-2.5 py-1 rounded border border-stone-700/60 transition-colors"
                  title="Yolu Kopyala"
                >
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-semibold text-white">{selectedFile.path}</span>
                  {copiedPath ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-stone-400" />}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-white text-xs font-mono rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer border border-stone-700"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Kopyalandı!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-stone-300" />
                      <span>{t.copyCode}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownloadFile}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-black font-semibold text-xs font-mono rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Dosyayı İndir</span>
                </button>
              </div>
            </div>

            {/* Description Sub-bar */}
            <div className="bg-[#0e1017] px-6 py-2 border-b border-stone-800/60 text-xs text-stone-400 flex items-center justify-between">
              <span>{selectedFile.description}</span>
              <span className="text-[10px] font-mono text-amber-400/80">PHP 8.2+ / Apache / XAMPP</span>
            </div>

            {/* Code Preformatted Block */}
            <div className="flex-1 overflow-auto p-5 sm:p-6 font-mono text-xs leading-relaxed selection:bg-amber-500/30 selection:text-white">
              <pre className="whitespace-pre font-mono text-stone-200">
                <code>{selectedFile.code}</code>
              </pre>
            </div>

            {/* Simulated Browser Output Panel (Matching slides' 'TARAYICI ÇIKTISI') */}
            {selectedFile.expectedOutput && (
              <div className="bg-[#12141D] border-t border-stone-800/80 p-4 shrink-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Play className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[11px] font-mono uppercase font-bold text-emerald-400 tracking-wider">
                      TARAYICI ÇIKTISI (BROWSER OUTPUT)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-stone-500">
                    http://localhost/internet2/...
                  </span>
                </div>
                <div className="bg-white text-black p-3.5 rounded-lg font-sans text-xs shadow-inner leading-relaxed border border-stone-300"
                  dangerouslySetInnerHTML={{ __html: selectedFile.expectedOutput }}
                />
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
