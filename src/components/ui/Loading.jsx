import React from "react";

const Loading = () => {
  return (
    <div className="space-y-4">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse"></div>
        <div className="flex space-x-2">
          <div className="h-10 w-24 bg-slate-200 rounded animate-pulse"></div>
          <div className="h-10 w-20 bg-slate-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Search and filters skeleton */}
      <div className="flex space-x-4">
        <div className="flex-1 h-10 bg-slate-200 rounded animate-pulse"></div>
        <div className="h-10 w-32 bg-slate-200 rounded animate-pulse"></div>
      </div>

      {/* Table skeleton */}
      <div className="bg-white rounded-lg border border-slate-200">
        {/* Table header */}
        <div className="border-b border-slate-200 p-4">
          <div className="grid grid-cols-7 gap-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-4 bg-slate-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
        
        {/* Table rows */}
        {[...Array(8)].map((_, i) => (
          <div key={i} className="border-b border-slate-100 p-4">
            <div className="grid grid-cols-7 gap-4 items-center">
              <div className="h-4 bg-slate-100 rounded animate-pulse"></div>
              <div className="h-4 bg-slate-100 rounded animate-pulse"></div>
              <div className="h-4 bg-slate-100 rounded animate-pulse"></div>
              <div className="h-6 w-16 bg-slate-100 rounded-full animate-pulse"></div>
              <div className="h-4 bg-slate-100 rounded animate-pulse"></div>
              <div className="h-4 bg-slate-100 rounded animate-pulse"></div>
              <div className="h-8 w-20 bg-slate-100 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;