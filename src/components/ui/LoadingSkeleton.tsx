import React from 'react';

export function SkeletonLine({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />;
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 p-5 ${className}`}>
      <div className="animate-pulse space-y-3">
        <div className="h-3 bg-slate-200 rounded w-1/3" />
        <div className="h-8 bg-slate-200 rounded w-1/2" />
        <div className="h-2 bg-slate-100 rounded w-2/3" />
      </div>
    </div>
  );
}

export function SkeletonTableRow({ cols = 8 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={`skel-col-${i}`} className="px-4 py-3">
          <div className="h-4 bg-slate-200 rounded animate-pulse" style={{ width: `${60 + (i % 3) * 15}%` }} />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonTable({ rows = 6, cols = 8 }: { rows?: number; cols?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonTableRow key={`skel-row-${i}`} cols={cols} />
      ))}
    </>
  );
}