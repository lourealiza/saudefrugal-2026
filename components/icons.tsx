type IconProps = { size?: number; className?: string };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const Leaf = ({ size = 24, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden>
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6" />
  </svg>
);

export const Arrow = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const Check = ({ size = 14, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const Play = ({ size = 22, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M8 5v14l11-7z" />
  </svg>
);

export const Course = ({ size = 24, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden>
    <path d="M2 7l10-4 10 4-10 4L2 7Z" />
    <path d="M6 9v5c0 1.4 2.7 3 6 3s6-1.6 6-3V9M22 7v6" />
  </svg>
);

export const Retreat = ({ size = 24, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden>
    <path d="M3 21h18M5 21V8l7-5 7 5v13" />
    <path d="M9 21v-6h6v6" />
  </svg>
);

export const Book = ({ size = 24, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
  </svg>
);

export const Consult = ({ size = 24, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
    <path d="M12 7v6M9 10h6" />
  </svg>
);

export const Menu = ({ size = 26, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const WhatsApp = ({ size = 30, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M.06 24l1.68-6.12A11.87 11.87 0 0 1 .14 11.9C.14 5.34 5.48 0 12.04 0a11.82 11.82 0 0 1 8.41 3.49 11.82 11.82 0 0 1 3.48 8.42c0 6.56-5.34 11.9-11.9 11.9a11.9 11.9 0 0 1-5.68-1.45L.06 24Zm6.6-3.8c1.68.99 3.28 1.59 5.38 1.59 5.45 0 9.89-4.43 9.89-9.88 0-5.46-4.43-9.89-9.88-9.89C6.6 2.02 2.16 6.45 2.16 11.9c0 2.2.64 3.85 1.72 5.58l-.99 3.62 3.77-.99Zm11.4-5.1c-.07-.12-.27-.2-.56-.34-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.42Z" />
  </svg>
);

export const Instagram = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden>
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <path d="M17.5 6.5h.01" />
  </svg>
);

export const Youtube = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden>
    <path d="M22.5 6.9a2.8 2.8 0 0 0-2-2C18.8 4.5 12 4.5 12 4.5s-6.8 0-8.5.4a2.8 2.8 0 0 0-2 2A29 29 0 0 0 1.2 12a29 29 0 0 0 .4 5.1 2.8 2.8 0 0 0 2 2c1.7.4 8.5.4 8.5.4s6.8 0 8.5-.4a2.8 2.8 0 0 0 2-2 29 29 0 0 0 .4-5.1 29 29 0 0 0-.4-5.1Z" />
    <path d="m9.8 15.3 5.7-3.3-5.7-3.3v6.6Z" fill="currentColor" />
  </svg>
);

export const Spotify = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <path d="M7 9.5c3.2-1 6.8-.6 9.5 1M7.5 13c2.6-.8 5.4-.5 7.5 1M8 16c2-.6 4-.4 5.5.7" />
  </svg>
);

export const Facebook = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3Z" />
  </svg>
);

export const TikTok = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden>
    <path d="M14 3c.4 2.3 1.9 3.9 4 4.2v3c-1.5 0-2.9-.4-4-1.2V15a5 5 0 1 1-5-5c.3 0 .7 0 1 .1v3.1a2 2 0 1 0 1 1.8V3h3Z" />
  </svg>
);

export const Kwai = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="6" />
    <path d="M10 9l5 3-5 3V9Z" fill="currentColor" />
  </svg>
);
