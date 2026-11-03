import React from 'react';

export const SkipLink: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-[#C9A96E] focus:text-[#0F0F10] focus:font-bold focus:rounded-md focus:shadow-lg focus:outline-2 focus:outline-offset-2 focus:outline-[#0F0F10]"
    >
      Skip to main content
    </a>
  );
};
