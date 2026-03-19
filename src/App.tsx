import React, { useState, useCallback } from 'react';
import { MermaidRenderer } from './components/MermaidRenderer';
import { LegalModal } from './components/LegalModal';
import { Download, FileCode, Copy, Check } from 'lucide-react';

const INITIAL_CODE = `graph TD
    A[開始] --> B{選択}
    B -->|Yes| C[処理1]
    B -->|No| D[処理2]
    C --> E[終了]
    D --> E`;

export default function App() {
  const [code, setCode] = useState(INITIAL_CODE);
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [isCopying, setIsCopying] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);

  const handleSvgRendered = useCallback((svg: string) => {
    setSvgContent(svg);
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopying(true);
      setTimeout(() => setIsCopying(false), 2000);
    } catch (err) {
      console.error('コピーに失敗しました:', err);
    }
  };

  const downloadSvg = () => {
    if (!svgContent) return;

    // SVG にフォントスタイルを埋め込んでポータブルに
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
    const svgElement = svgDoc.documentElement;

    const styleElement = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    styleElement.textContent = `
      text, .node text, .edgeLabel text, .label text {
        font-family: "Inter", "Noto Sans JP", "Hiragino Kaku Gothic ProN", "Meiryo", sans-serif !important;
      }
    `;
    svgElement.insertBefore(styleElement, svgElement.firstChild);

    const blob = new Blob([new XMLSerializer().serializeToString(svgElement)], { type: 'image/svg+xml' });
    triggerDownload(URL.createObjectURL(blob), 'mermaid-diagram.svg');
  };

  const downloadPng = () => {
    if (!svgContent) return;

    const parser = new DOMParser();
    const svgElement = parser.parseFromString(svgContent, 'image/svg+xml').documentElement as unknown as SVGSVGElement;
    const width = svgElement.viewBox?.baseVal?.width || 800;
    const height = svgElement.viewBox?.baseVal?.height || 600;
    const scale = 2;

    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(scale, scale);

    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, width, height);
      try {
        triggerDownload(canvas.toDataURL('image/png'), 'mermaid-diagram.png');
      } catch (err) {
        console.error('PNG エクスポートに失敗しました:', err);
        alert('PNG のエクスポートに失敗しました。SVG でのエクスポートをお試しください。');
      }
    };
    img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgContent)))}`;
  };

  const triggerDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (url.startsWith('blob:')) URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F4] text-[#1C1917] font-sans">
      {/* ヘッダー */}
      <header className="h-16 border-b border-zinc-200 bg-white flex items-center justify-between px-6 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white">
              <FileCode size={20} />
            </div>
            <h1 className="font-bold text-lg tracking-tight hidden md:block">Mermaid to Image Converter</h1>
          </div>
          <a
            href="https://github.com/momerio/mermaid-to-image-converter"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
            title="GitHub で見る"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            <span className="hidden sm:inline">Github</span>
          </a>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={downloadSvg}
            disabled={!svgContent}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-zinc-100 text-zinc-900 hover:bg-zinc-200 border border-zinc-200 rounded-lg transition-all cursor-pointer shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download size={16} className="text-orange-600" />
            <span>Export SVG</span>
          </button>
          <button
            onClick={downloadPng}
            disabled={!svgContent}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-zinc-900 text-white hover:bg-zinc-800 rounded-lg transition-all shadow-md cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download size={16} />
            <span>Export PNG</span>
          </button>
        </div>
      </header>

      <main className="flex h-[calc(100vh-64px-32px)] overflow-hidden">
        {/* エディタペイン */}
        <div className="w-1/2 border-r border-zinc-200 bg-white flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-100 bg-zinc-50/50">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Mermaid Markdown</span>
            <button
              onClick={copyToClipboard}
              className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded transition-all cursor-pointer"
              title="クリップボードにコピー"
            >
              {isCopying ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
            </button>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 p-6 font-mono text-sm resize-none focus:outline-none bg-white leading-relaxed"
            spellCheck={false}
            placeholder="Mermaid のコードを入力してください..."
          />
        </div>

        {/* プレビューペイン */}
        <div className="w-1/2 bg-[#F5F5F4] p-8 overflow-auto flex flex-col">
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">Live Preview</span>
          <MermaidRenderer code={code} onSvgRendered={handleSvgRendered} />
        </div>
      </main>

      {/* フッター */}
      <footer className="h-8 bg-zinc-50 border-t border-zinc-200 flex items-center justify-center gap-3 text-[10px] text-zinc-400 font-medium tracking-tight">
        <span>&copy; {new Date().getFullYear()} momerio</span>
        <span className="text-zinc-300">|</span>
        <button
          onClick={() => setIsLegalOpen(true)}
          className="hover:text-zinc-600 transition-colors cursor-pointer underline underline-offset-2"
        >
          プライバシーポリシー・免責事項
        </button>
      </footer>

      {/* 法的情報モーダル */}
      <LegalModal isOpen={isLegalOpen} onClose={() => setIsLegalOpen(false)} />
    </div>
  );
}
