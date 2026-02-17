'use client';

import Link from 'next/link';
import {
  RotateCcw,
  Copy,
  Download,
  Link2,
  Moon,
  Sun,
  FileText,
  Check,
  PanelTopClose,
  PanelTopOpen,
} from 'lucide-react';

type ToolbarProps = {
  isDark: boolean;
  onToggleTheme: () => void;
  syncScroll: boolean;
  onToggleSyncScroll: (value: boolean) => void;
  onReset: () => void;
  onCopy: () => void;
  onExportPdf: () => void;
  copyLabel: string;
  exportPdfLabel?: string;
  wordCount: number;
  charCount: number;
  lineCount: number;
  navbarExpanded: boolean;
  onToggleNavbar: () => void;
  githubRepoUrl: string;
};

function GitHubIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

const btnClass =
  'inline-flex items-center justify-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 disabled:opacity-50 disabled:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0';

export function Toolbar({
  isDark,
  onToggleTheme,
  syncScroll,
  onToggleSyncScroll,
  onReset,
  onCopy,
  onExportPdf,
  copyLabel,
  exportPdfLabel = 'Export PDF',
  wordCount,
  charCount,
  lineCount,
  navbarExpanded,
  onToggleNavbar,
  githubRepoUrl,
}: ToolbarProps) {
  const expandBtnClass =
    'inline-flex items-center justify-center rounded-md p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 [&_svg]:size-5';

  const githubLink = githubRepoUrl ? (
    <a
      href={githubRepoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center rounded-md p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 [&_svg]:size-5"
      title="View on GitHub"
      aria-label="View on GitHub"
    >
      <GitHubIcon />
    </a>
  ) : null;

  if (!navbarExpanded) {
    return (
      <header className="shrink-0 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between px-3 py-2">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
            aria-label="Markdown Live Preview – Home"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
              <FileText className="size-3.5 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">Markdown Live Preview</span>
          </Link>
          <div className="flex items-center gap-1">
            {githubLink}
            <button
              type="button"
              onClick={onToggleNavbar}
              className={expandBtnClass}
              title="Expand navbar"
            >
              <PanelTopOpen />
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="shrink-0 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
        <Link
          href="/"
          className="flex items-center gap-2 md:gap-3 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
          aria-label="Markdown Live Preview – Home"
        >
          <div className="flex h-8 w-8 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-lg md:rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
            <FileText className="size-4 md:size-5 text-white" />
          </div>
          <div>
            <h1 className="text-base md:text-xl font-semibold text-gray-900 dark:text-white">
              Markdown Live Preview
            </h1>
            <p className="hidden text-xs md:text-sm text-gray-500 dark:text-gray-400 sm:block">
              Real-time markdown editor & previewer
            </p>
          </div>
        </Link>
        <div className="flex items-center gap-1 md:gap-2">
          <button type="button" onClick={onReset} className={`${btnClass} gap-2 hidden md:inline-flex`}>
            <RotateCcw />
            <span className="hidden lg:inline">Reset</span>
          </button>
          <button type="button" onClick={onReset} className={`${btnClass} md:hidden`}>
            <RotateCcw />
          </button>
          <button type="button" onClick={onCopy} className={`${btnClass} gap-2 hidden md:inline-flex`}>
            {copyLabel === 'Copied!' ? <Check /> : <Copy />}
            <span className="hidden lg:inline">{copyLabel}</span>
          </button>
          <button type="button" onClick={onCopy} className={`${btnClass} md:hidden`}>
            {copyLabel === 'Copied!' ? <Check /> : <Copy />}
          </button>
          <button
            type="button"
            onClick={onExportPdf}
            disabled={exportPdfLabel === 'Exporting…'}
            className={`${btnClass} gap-2 hidden sm:inline-flex`}
          >
            <Download />
            <span className="hidden lg:inline">{exportPdfLabel}</span>
          </button>
          <div className="mx-1 hidden h-6 w-px bg-gray-200 dark:bg-gray-700 sm:block" />
          <button
            type="button"
            onClick={() => onToggleSyncScroll(!syncScroll)}
            className={`${btnClass} gap-2 hidden md:inline-flex ${syncScroll ? 'text-violet-600 dark:text-violet-400' : ''}`}
            title={syncScroll ? 'Sync scroll on' : 'Sync scroll off'}
          >
            <Link2 />
            <span className="hidden lg:inline">Sync scroll</span>
          </button>
          <button
            type="button"
            onClick={onToggleTheme}
            className={btnClass}
            title={isDark ? 'Switch to light' : 'Switch to dark'}
          >
            {isDark ? <Sun /> : <Moon />}
          </button>
          <button
            type="button"
            onClick={onToggleNavbar}
            className={expandBtnClass}
            title="Collapse navbar to see more of the editor"
          >
            <PanelTopClose />
          </button>
          {githubLink}
        </div>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 px-4 md:px-6 py-2">
        <div className="flex flex-wrap items-center gap-3 md:gap-6 text-xs md:text-sm text-gray-600 dark:text-gray-400">
          <span>{wordCount} words</span>
          <span>•</span>
          <span>{charCount.toLocaleString()} characters</span>
          <span>•</span>
          <span>{lineCount} lines</span>
        </div>
      </div>
    </header>
  );
}
