import React, { useMemo, useState } from 'react';
import katex from 'katex';
import { Copy, Check } from 'lucide-react';

interface MathViewProps {
  math: string;
  block?: boolean;
  className?: string;
  showCopy?: boolean;
}

/**
 * Universal KaTeX mathematical renderer.
 * Formats pure LaTeX expressions into publication-grade mathematical typography
 * with interactive "Copy TeX" capability and robust syntax fallback.
 */
export const MathView: React.FC<MathViewProps> = ({
  math,
  block = false,
  className = '',
  showCopy = true,
}) => {
  const [copied, setCopied] = useState(false);

  // Clean and prepare the LaTeX string
  const cleanMath = useMemo(() => {
    if (!math) return '';
    let s = math.trim();
    // Strip surrounding $ or $$ if provided
    if (s.startsWith('$$') && s.endsWith('$$') && s.length >= 4) {
      s = s.slice(2, -2).trim();
    } else if (s.startsWith('$') && s.endsWith('$') && s.length >= 2) {
      s = s.slice(1, -1).trim();
    }
    return s;
  }, [math]);

  const { html, isError } = useMemo(() => {
    if (!cleanMath) return { html: '', isError: false };
    try {
      const rendered = katex.renderToString(cleanMath, {
        displayMode: block,
        throwOnError: false,
        strict: false,
        trust: true,
      });
      return { html: rendered, isError: false };
    } catch {
      return { html: cleanMath, isError: true };
    }
  }, [cleanMath, block]);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(cleanMath).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!cleanMath) return null;

  if (isError) {
    return (
      <code className={`font-mono text-amber-300 text-xs px-1.5 py-0.5 rounded bg-amber-950/30 border border-amber-900/40 ${className}`}>
        {cleanMath}
      </code>
    );
  }

  if (block) {
    return (
      <div className={`relative group my-2 p-3 rounded-lg bg-[#0b0f19]/90 border border-slate-800/80 hover:border-slate-700/80 transition-all overflow-x-auto text-slate-100 ${className}`}>
        <div
          className="katex-block-wrapper flex items-center justify-center min-w-max py-1 px-2"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        {showCopy && (
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-xs text-slate-400 hover:text-amber-300 bg-slate-900/90 hover:bg-slate-800 rounded border border-slate-700/70 flex items-center gap-1 shadow cursor-pointer"
            title="Copia codice sorgente LaTeX"
            aria-label="Copia formula LaTeX"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] text-emerald-400 font-mono">Copiato!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span className="text-[10px] font-mono">TeX</span>
              </>
            )}
          </button>
        )}
      </div>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 group/inline ${className}`}>
      <span
        className="katex-inline-wrapper"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {showCopy && (
        <button
          onClick={handleCopy}
          className="hidden group-hover/inline:inline-flex p-0.5 text-slate-500 hover:text-amber-300 cursor-pointer transition-colors"
          title="Copia formula LaTeX"
          aria-label="Copia formula LaTeX"
        >
          {copied ? (
            <Check className="w-2.5 h-2.5 text-emerald-400" />
          ) : (
            <Copy className="w-2.5 h-2.5" />
          )}
        </button>
      )}
    </span>
  );
};
