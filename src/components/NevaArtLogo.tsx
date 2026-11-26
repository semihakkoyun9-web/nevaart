import React from 'react';

interface NevaArtLogoProps {
  theme?: 'light' | 'dark';
  size?: 'sm' | 'md';
}

export const NevaArtLogo: React.FC<NevaArtLogoProps> = ({
  theme = 'light',
  size = 'md',
}) => {
  const dimClass = size === 'sm' ? 'w-8 h-8' : 'w-8 h-8 sm:w-10 sm:h-10';
  const isDark = theme === 'dark';

  return (
    <svg
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${dimClass} shrink-0 transition-transform duration-300 group-hover:scale-[1.03]`}
      aria-hidden="true"
    >
      {/* Gallery Obsidian / Parchment Backing */}
      <rect
        x="1"
        y="1"
        width="42"
        height="42"
        rx="4"
        fill={isDark ? '#1A1A1D' : '#111113'}
        stroke="#C59B5F"
        strokeWidth="1.2"
        strokeOpacity={isDark ? '0.65' : '0.45'}
      />

      {/* Inner Classical Gallery Frame & Golden-Ratio Arch */}
      <rect
        x="5"
        y="5"
        width="34"
        height="34"
        rx="2"
        stroke="#C59B5F"
        strokeWidth="0.75"
        strokeOpacity="0.45"
      />
      <path
        d="M11 33V20C11 13.9249 15.9249 9 22 9C28.0751 9 33 13.9249 33 20V33"
        stroke="#C59B5F"
        strokeWidth="1"
        strokeOpacity="0.55"
      />

      {/* Sculpted Architectural N Monogram + Brushstroke Ribbon */}
      <path
        d="M15.5 31V15.5L28.5 31V15.5"
        stroke="#FAF8F5"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.5 16.5C19.5 20.5 24.5 26.5 28.5 30"
        stroke="#C59B5F"
        strokeWidth="2.3"
        strokeLinecap="round"
      />

      {/* Top Sun / Palette Accent */}
      <circle cx="22" cy="13.5" r="1.4" fill="#C59B5F" />
    </svg>
  );
};
