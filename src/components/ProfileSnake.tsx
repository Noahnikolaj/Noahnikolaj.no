"use client";

import React from "react";

export const ProfileSnake = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex items-center justify-center p-1">
      {/* Snake Animation Ring */}
      <div className="absolute inset-0 rounded-full animate-spin-slow">
         <svg className="w-full h-full" viewBox="0 0 100 100">
            <path
              id="snakePath"
              d="M 50, 50 m -48, 0 a 48,48 0 1,0 96,0 a 48,48 0 1,0 -96,0"
              fill="none"
              stroke="rgba(244, 114, 182, 1)" /* chart-1 pink */
              strokeWidth="2"
              strokeDasharray="20 281" /* Adjusted for a "snake" length relative to circumference (~301) */
              strokeLinecap="round"
            />
         </svg>
      </div>
      
      {/* Content (Profile Pic) */}
      <div className="relative z-10 rounded-full overflow-hidden border-2 border-transparent">
        {children}
      </div>

       <style jsx>{`
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};
