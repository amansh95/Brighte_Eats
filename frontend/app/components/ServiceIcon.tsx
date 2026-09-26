const ICONS: Record<string, React.ReactNode> = {
  delivery: (
    <>
      <path d="M4 12h24v20H4z" fill="var(--icon-fill)" />
      <path d="M4 12h24v20H4zM28 18h8l6 7v7H28z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="12" cy="34" r="4" fill="var(--surface)" stroke="currentColor" strokeWidth="2" />
      <circle cx="34" cy="34" r="4" fill="var(--surface)" stroke="currentColor" strokeWidth="2" />
    </>
  ),
  "pick-up": (
    <>
      <path d="M10 16h28l-2 24H12z" fill="var(--icon-fill)" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M18 20v-6a6 6 0 0 1 12 0v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  payment: (
    <>
      <rect x="5" y="12" width="38" height="24" rx="4" fill="var(--icon-fill)" stroke="currentColor" strokeWidth="2" />
      <path d="M5 19h38" stroke="currentColor" strokeWidth="2" />
      <path d="M11 29h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
};

const DEFAULT_ICON = (
  <>
    <circle cx="24" cy="24" r="16" fill="var(--icon-fill)" stroke="currentColor" strokeWidth="2" />
    <path d="M24 17v14M17 24h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </>
);

export default function ServiceIcon({ code }: { code: string }) {
  return (
    <svg className="service-icon" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      {ICONS[code] ?? DEFAULT_ICON}
    </svg>
  );
}
