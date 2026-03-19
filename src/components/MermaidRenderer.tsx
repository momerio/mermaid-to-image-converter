import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import DOMPurify from 'dompurify';

// securityLevel: 'strict' = htmlLabels 無効化でスクリプトインジェクションを防止
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  // レンダリングは loose で日本語 HTML ラベルを有効化。
  // XSS 対策は DOMPurify サニタイズ + CSP で担保する。
  securityLevel: 'loose',
  fontFamily: '"Hiragino Kaku Gothic ProN", "Hiragino Sans", "Meiryo", "Yu Gothic", sans-serif',
});

interface Props {
  code: string;
  onSvgRendered?: (svg: string) => void;
}

export const MermaidRenderer: React.FC<Props> = ({ code, onSvgRendered }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const render = async () => {
      const trimmed = code.trim();
      if (!containerRef.current) return;

      if (!trimmed) {
        setError(null);
        containerRef.current.innerHTML = '';
        return;
      }

      try {
        await mermaid.parse(trimmed);
        setError(null);

        const id = `mermaid-${Math.random().toString(36).slice(2, 11)}`;
        containerRef.current.innerHTML = '';

        const { svg } = await mermaid.render(id, trimmed);

        // DOMPurify で SVG をサニタイズしてから挿入（XSS 対策）
        // foreignObject は Mermaid がテキスト描画に使用するため許可する
        const sanitized = DOMPurify.sanitize(svg, {
          USE_PROFILES: { svg: true, svgFilters: true },
          ADD_TAGS: ['foreignObject', 'foreignobject'],
          ADD_ATTR: ['dominant-baseline', 'requiredExtensions', 'transform-origin'],
        });

        if (containerRef.current) {
          containerRef.current.innerHTML = sanitized;
          onSvgRendered?.(sanitized);
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : '不明なエラー';
        console.error('Mermaid エラー:', err);
        setError(message);
      }
    };

    const timer = setTimeout(render, 300);
    return () => clearTimeout(timer);
  }, [code, onSvgRendered]);

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center bg-white rounded-lg overflow-auto p-4 border border-zinc-200 shadow-inner min-h-[400px] relative">
      {error && (
        <div className="absolute inset-0 z-10 p-6 bg-red-50/95 backdrop-blur-sm overflow-auto flex items-center justify-center">
          <div className="max-w-full">
            <h3 className="text-red-600 font-bold mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
              シンタックスエラー
            </h3>
            <div className="text-red-500 font-mono text-xs bg-white p-4 rounded border border-red-200 shadow-sm whitespace-pre-wrap break-all">
              {error}
            </div>
            <p className="mt-4 text-zinc-400 text-xs text-center italic">
              コードを修正するとプレビューが再開されます
            </p>
          </div>
        </div>
      )}
      <div
        ref={containerRef}
        className={`mermaid-container w-full h-full flex items-center justify-center ${error ? 'opacity-20 grayscale' : ''}`}
      />
    </div>
  );
};
