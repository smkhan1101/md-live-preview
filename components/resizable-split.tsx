'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const MIN_PANE_PX = 120;
const DIVIDER_PX = 6;
const DEFAULT_RATIO = 0.5;

type ResizableSplitProps = {
  left: React.ReactNode;
  right: React.ReactNode;
  className?: string;
};

export function ResizableSplit({ left, right, className = '' }: ResizableSplitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [leftRatio, setLeftRatio] = useState(DEFAULT_RATIO);
  const [isDragging, setDragging] = useState(false);
  const lastRatioRef = useRef(DEFAULT_RATIO);

  const updatePanes = useCallback((ratio: number) => {
    const leftPct = Math.max(0.1, Math.min(0.9, ratio)) * 100;
    const leftEl = containerRef.current?.querySelector('[data-pane="left"]') as HTMLElement | null;
    const rightEl = containerRef.current?.querySelector('[data-pane="right"]') as HTMLElement | null;
    if (leftEl) leftEl.style.width = `${leftPct}%`;
    if (rightEl) rightEl.style.width = `${100 - leftPct}%`;
    lastRatioRef.current = ratio;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const total = container.offsetWidth;
    const leftW = total * lastRatioRef.current - DIVIDER_PX / 2;
    const ratio = leftW / (total - DIVIDER_PX);
    updatePanes(ratio);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      if (!container || isDragging) return;
      const total = container.offsetWidth;
      const leftEl = container.querySelector('[data-pane="left"]') as HTMLElement | null;
      const leftW = leftEl?.offsetWidth ?? total * lastRatioRef.current;
      updatePanes(leftW / (total - DIVIDER_PX));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isDragging, updatePanes]);

  const handleMouseDown = useCallback(() => setDragging(true), []);
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const total = rect.width - DIVIDER_PX;
      const ratio = Math.max(MIN_PANE_PX / total, Math.min(1 - MIN_PANE_PX / total, x / total));
      setLeftRatio(ratio);
      updatePanes(ratio);
    },
    [isDragging, updatePanes]
  );
  const handleMouseUp = useCallback(() => setDragging(false), []);

  useEffect(() => {
    if (!isDragging) return;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleDividerDoubleClick = useCallback(() => {
    setLeftRatio(DEFAULT_RATIO);
    updatePanes(DEFAULT_RATIO);
  }, [updatePanes]);

  return (
    <div
      ref={containerRef}
      className={`flex flex-1 min-h-0 w-full ${className}`}
    >
      <div
        data-pane="left"
        className="shrink-0 min-w-0 h-full overflow-hidden"
        style={{ width: `${leftRatio * 100}%` }}
      >
        {left}
      </div>
      <div
        role="separator"
        aria-label="Resize panes"
        tabIndex={0}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDividerDoubleClick}
        className={`shrink-0 w-1.5 bg-[var(--divider)] cursor-col-resize hover:bg-gray-500 dark:hover:bg-gray-500 transition-colors ${
          isDragging ? 'bg-gray-500 dark:bg-gray-500' : ''
        }`}
      />
      <div
        data-pane="right"
        className="shrink-0 min-w-0 h-full overflow-hidden"
        style={{ width: `${(1 - leftRatio) * 100}%` }}
      >
        {right}
      </div>
    </div>
  );
}
