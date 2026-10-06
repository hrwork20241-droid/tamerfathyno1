import { useState, type CSSProperties, type ReactNode } from 'react';
import { useStore, type Mode } from './store';

export const FONT = "Archivo,'IBM Plex Sans Arabic'";
export const MONO = "'JetBrains Mono',monospace";

/** CSS `font` shorthand in the app's type stack. */
export const f = (weight: number, size: number, lh?: number | string) =>
  `${weight} ${size}px${lh !== undefined ? '/' + lh : ''} ${FONT}`;
export const mono = (weight: number, size: number) => `${weight} ${size}px ${MONO}`;

export const C = {
  ink: '#17150f',
  paper: '#f5f3ef',
  accent: '#e8452c',
  accentSoft: '#fff4f1',
  sale: '#ffd23f',
  ok: '#1f8a4c',
  muted: '#6b665c',
  faint: '#8a8478',
  line: '#e6e2da',
  lineSoft: '#efece6',
  border: '#e0dbd2',
  field: '#d6d0c5',
  body: '#3d3a33',
};

const STRIPES = {
  light: ['#ece8e1', '#e4dfd6'],
  dark: ['#2c2a24', '#24221d'],
};

/**
 * Image box. With `src` it shows that image (cropped to fill); without one, or
 * if the image fails to load, it shows the design's diagonal-stripe placeholder and `label`.
 */
export function Ph({ src, alt = '', label, step = 8, tone = 'light', fontSize = 10, style, children, onClick }: {
  src?: string;
  alt?: string;
  label?: ReactNode;
  step?: number;
  tone?: keyof typeof STRIPES;
  fontSize?: number;
  style?: CSSProperties;
  children?: ReactNode;
  onClick?: () => void;
}) {
  const [a, b] = STRIPES[tone];
  const [failed, setFailed] = useState<string>();
  if (src && failed === src) src = undefined;
  return (
    <div
      onClick={onClick}
      style={{
        background: src ? a : `repeating-linear-gradient(135deg,${a} 0 ${step}px,${b} ${step}px ${step * 2}px)`,
        ...(src ? { position: 'relative', overflow: 'hidden' } : null),
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        font: mono(500, fontSize), color: C.faint,
        cursor: onClick ? 'pointer' : undefined,
        ...style,
      }}
    >
      {src
        ? <img src={src} alt={alt} loading="lazy" draggable={false} onError={() => setFailed(src)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        : label}
      {children}
    </div>
  );
}

export function BackButton({ style }: { style?: CSSProperties }) {
  const { back, t } = useStore();
  return (
    <button
      onClick={back}
      aria-label="Back"
      style={{ width: 40, height: 40, flex: 'none', borderRadius: '50%', border: 'none', background: '#fff', font: f(700, 18), ...style }}
    >
      {t('back')}
    </button>
  );
}

/** Back button plus a 24px screen title. */
export function BackHeader({ title, ellipsis }: { title: ReactNode; ellipsis?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <BackButton />
      <div
        style={{
          font: f(900, 24), letterSpacing: -1,
          ...(ellipsis ? { flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } : null),
        }}
      >
        {title}
      </div>
    </div>
  );
}

/** Retail / wholesale segmented control. */
export function ModeSwitch({ compact }: { compact?: boolean }) {
  const { s, t, setMode } = useStore();
  const modes: [Mode, 'retail' | 'wholesale', 'retailSub' | 'wholesaleSub', 'retailMode' | 'wholesaleMode'][] = [
    ['retail', 'retail', 'retailSub', 'retailMode'],
    ['wholesale', 'wholesale', 'wholesaleSub', 'wholesaleMode'],
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: C.line, borderRadius: 12, padding: 4, gap: 4 }}>
      {modes.map(([k, label, sub, modeLabel]) => {
        const on = s.mode === k;
        return (
          <button
            key={k}
            onClick={() => setMode(k)}
            aria-pressed={on}
            style={{
              height: 38, border: 'none', borderRadius: 9, background: on ? C.ink : 'transparent', color: on ? '#fff' : C.ink,
              font: f(700, 13),
              ...(compact ? null : { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }),
            }}
          >
            {compact ? t(modeLabel) : <>{t(label)}<span style={{ font: f(500, 10), opacity: 0.7 }}>{t(sub)}</span></>}
          </button>
        );
      })}
    </div>
  );
}

/** Pill chip colours: filled ink when active, outlined otherwise. */
export const chip = (active: boolean) => ({
  background: active ? C.ink : '#fff',
  color: active ? '#fff' : C.ink,
  borderColor: active ? C.ink : C.border,
});

export const stop = (e: { stopPropagation: () => void }) => e.stopPropagation();

export const screenPad: CSSProperties = { padding: '6px 16px 24px', display: 'flex', flexDirection: 'column', gap: 14 };
