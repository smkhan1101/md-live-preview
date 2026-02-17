'use client';

import { useCallback, useRef, useState, useEffect } from 'react';
import { Edit3, Eye, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Toolbar } from '@/components/toolbar';
import { MarkdownPreview } from '@/components/markdown-preview';
import { MarkdownEditor } from '@/components/markdown-editor';
import { ResizableSplit } from '@/components/resizable-split';
import {
  DEFAULT_MARKDOWN,
  GITHUB_REPO_URL,
  STORAGE_NAMESPACE,
  STORAGE_KEY_CONTENT,
  STORAGE_KEY_SYNC_SCROLL,
  STORAGE_KEY_THEME,
  STORAGE_KEY_NAVBAR_EXPANDED,
  CONFIRM_RESET_MESSAGE,
} from '@/lib/constants';
import { useLocalStorage } from '@/lib/use-local-storage';

const MD_BREAKPOINT = 768;

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MD_BREAKPOINT - 1}px)`);
    setIsMobile(mql.matches);
    const handler = () => setIsMobile(mql.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);
  return isMobile;
}

function getStoredContent(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(`${STORAGE_NAMESPACE}:${STORAGE_KEY_CONTENT}`);
  } catch {
    return null;
  }
}

function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
}

function countLines(text: string): number {
  return text ? text.split('\n').length : 0;
}

export default function MarkdownLivePreviewPage() {
  const [content, setContent] = useState(DEFAULT_MARKDOWN);
  const [syncScroll, setSyncScroll] = useLocalStorage(
    `${STORAGE_NAMESPACE}:${STORAGE_KEY_SYNC_SCROLL}`,
    false
  );
  const [isDark, setDark] = useLocalStorage(
    `${STORAGE_NAMESPACE}:${STORAGE_KEY_THEME}`,
    false
  );
  const [navbarExpanded, setNavbarExpanded] = useLocalStorage(
    `${STORAGE_NAMESPACE}:${STORAGE_KEY_NAVBAR_EXPANDED}`,
    true
  );
  const [copyLabel, setCopyLabel] = useState('Copy output');
  const [isPdfExporting, setPdfExporting] = useState(false);
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');
  const isMobile = useIsMobile();
  const editorScrollRef = useRef<HTMLDivElement | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const isUserScrollRef = useRef(false);

  useEffect(() => {
    const stored = getStoredContent();
    if (stored) setContent(stored);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const saveContent = useCallback((value: string) => {
    try {
      window.localStorage.setItem(`${STORAGE_NAMESPACE}:${STORAGE_KEY_CONTENT}`, value);
    } catch {
      // ignore
    }
  }, []);

  const handleEditorChange = useCallback(
    (value: string) => {
      setContent(value);
      saveContent(value);
    },
    [saveContent]
  );

  const handleEditorScroll = useCallback(() => {
    if (!syncScroll || !editorScrollRef.current || !previewRef.current) return;
    isUserScrollRef.current = true;
    const el = editorScrollRef.current;
    const maxScroll = el.scrollHeight - el.clientHeight;
    const ratio = maxScroll > 0 ? el.scrollTop / maxScroll : 0;
    const preview = previewRef.current;
    const previewMax = preview.scrollHeight - preview.clientHeight;
    preview.scrollTo(0, previewMax * ratio);
    requestAnimationFrame(() => {
      isUserScrollRef.current = false;
    });
  }, [syncScroll]);

  const handlePreviewScroll = useCallback(() => {
    if (!syncScroll || isUserScrollRef.current || !editorScrollRef.current || !previewRef.current) return;
    const preview = previewRef.current;
    const previewMax = preview.scrollHeight - preview.clientHeight;
    const ratio = previewMax > 0 ? preview.scrollTop / previewMax : 0;
    const el = editorScrollRef.current;
    const elMax = el.scrollHeight - el.clientHeight;
    el.scrollTop = elMax * ratio;
  }, [syncScroll]);

  const handleReset = useCallback(() => {
    if (content !== DEFAULT_MARKDOWN && !window.confirm(CONFIRM_RESET_MESSAGE)) return;
    setContent(DEFAULT_MARKDOWN);
    saveContent(DEFAULT_MARKDOWN);
    editorScrollRef.current?.scrollTo(0, 0);
    previewRef.current?.scrollTo(0, 0);
    toast.success('Reset to default');
  }, [content, saveContent]);

  const handleCopy = useCallback(async () => {
    const el = document.getElementById('pdf-preview-source') as HTMLElement | null;
    if (!el) {
      toast.error('Preview not ready');
      return;
    }
    const text = el.innerText;
    const html = el.innerHTML;
    const fullHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>${html}</body></html>`;
    setCopyLabel('Copied!');
    setTimeout(() => setCopyLabel('Copy output'), 1500);
    try {
      const blobHtml = new Blob([fullHtml], { type: 'text/html' });
      const blobPlain = new Blob([text], { type: 'text/plain' });
      await navigator.clipboard.write([
        new ClipboardItem({ 'text/html': blobHtml, 'text/plain': blobPlain }),
      ]);
      toast.success('Output copied');
    } catch {
      try {
        await navigator.clipboard.writeText(text);
        toast.success('Output copied (plain text)');
      } catch {
        toast.error('Copy failed');
      }
    }
  }, []);

  const handleExportPdf = useCallback(async () => {
    const el = document.getElementById('pdf-preview-source');
    if (!el || isPdfExporting) return;
    setPdfExporting(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const opt = {
        margin: 12,
        filename: 'markdown-preview.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          onclone(clonedDoc: Document, clonedNode: HTMLElement) {
            const root = clonedNode;
            if (root) {
              root.style.backgroundColor = '#fff';
              root.style.color = '#1f2328';
              root.style.width = '210mm';
              root.style.maxWidth = '210mm';
              root.style.overflow = 'visible';
              root.style.height = 'auto';
              root.style.minHeight = 'auto';
            }
            const style = clonedDoc.createElement('style');
            style.textContent = `
              table tr, p, pre, li, h1, h2, h3, h4, h5, h6, blockquote, ul, ol {
                page-break-inside: avoid;
              }
            `;
            clonedDoc.head.appendChild(style);
          },
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
      };
      await html2pdf().set(opt).from(el).save();
      toast.success('PDF downloaded');
    } catch {
      toast.info('Use "Save as PDF" in the print dialog', { duration: 4000 });
      window.print();
    } finally {
      setPdfExporting(false);
    }
  }, [isPdfExporting]);

  const handleToggleTheme = useCallback(() => {
    setDark((prev) => !prev);
  }, [setDark]);

  const handleCopyMarkdown = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Markdown copied');
    } catch {
      toast.error('Copy failed');
    }
  }, [content]);

  const wordCount = countWords(content);
  const charCount = content.length;
  const lineCount = countLines(content);

  const editorPane = (
    <div className="flex h-full flex-col border-r border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 px-4 md:px-6 py-3">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Editor</span>
        <button
          type="button"
          onClick={handleCopyMarkdown}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 [&_svg]:size-3"
        >
          <Copy />
          Copy
        </button>
      </div>
      <div className="flex-1 min-h-0 bg-white dark:bg-gray-900">
        <MarkdownEditor
          value={content}
          onChange={handleEditorChange}
          onScroll={handleEditorScroll}
          isDark={isDark}
          scrollContainerRef={editorScrollRef}
        />
      </div>
    </div>
  );

  const previewPane = (
    <div className="flex h-full flex-col">
      <div className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 px-4 md:px-6 py-3">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Preview</span>
      </div>
      <div className="flex-1 min-h-0 overflow-hidden bg-white dark:bg-gray-900">
        <MarkdownPreview
          content={content}
          previewRef={previewRef}
          onScroll={handlePreviewScroll}
        />
      </div>
    </div>
  );

  return (
    <div className={`flex h-screen flex-col ${isDark ? 'dark bg-gray-950' : 'bg-gray-50'}`}>
      <Toolbar
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        syncScroll={syncScroll}
        onToggleSyncScroll={setSyncScroll}
        onReset={handleReset}
        onCopy={handleCopy}
        onExportPdf={handleExportPdf}
        copyLabel={copyLabel}
        exportPdfLabel={isPdfExporting ? 'Exporting…' : 'Export PDF'}
        wordCount={wordCount}
        charCount={charCount}
        lineCount={lineCount}
        navbarExpanded={navbarExpanded}
        onToggleNavbar={() => setNavbarExpanded((v) => !v)}
        githubRepoUrl={GITHUB_REPO_URL}
      />
      {isMobile && (
        <div className="flex border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <button
          type="button"
          onClick={() => setMobileView('editor')}
          className={`flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
            mobileView === 'editor'
              ? 'border-b-2 border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          <Edit3 className="size-4" />
          Editor
        </button>
        <button
          type="button"
          onClick={() => setMobileView('preview')}
          className={`flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
            mobileView === 'preview'
              ? 'border-b-2 border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          <Eye className="size-4" />
          Preview
        </button>
        </div>
      )}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {!isMobile ? (
          <div className="flex flex-1 min-h-0 w-full">
            <ResizableSplit left={editorPane} right={previewPane} />
          </div>
        ) : mobileView === 'editor' ? (
          <div className="h-full w-full flex flex-col">
            {editorPane}
          </div>
        ) : (
          <div className="h-full w-full flex flex-col">
            {previewPane}
          </div>
        )}
      </div>
    </div>
  );
}
