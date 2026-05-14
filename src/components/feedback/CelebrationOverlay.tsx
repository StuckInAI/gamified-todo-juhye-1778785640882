import { useEffect, useState } from 'react';

type Celebration = {
  title: string;
  message?: string;
  emoji?: string;
};

type CelebrationOverlayProps = {
  celebration?: Celebration | null;
  onDismiss?: () => void;
};

export default function CelebrationOverlay({ celebration, onDismiss }: CelebrationOverlayProps) {
  const [internal, setInternal] = useState<Celebration | null>(celebration ?? null);

  useEffect(() => {
    setInternal(celebration ?? null);
  }, [celebration]);

  if (!internal) return null;

  const handleDismiss = () => {
    setInternal(null);
    onDismiss?.();
  };

  return (
    <div
      onClick={handleDismiss}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          background: 'white',
          padding: '32px 40px',
          borderRadius: 20,
          textAlign: 'center',
          maxWidth: 360,
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        }}
      >
        <div style={{ fontSize: 56 }}>{internal.emoji ?? '🎉'}</div>
        <h2 style={{ marginTop: 12, fontFamily: 'var(--font-display)' }}>{internal.title}</h2>
        {internal.message && <p style={{ marginTop: 8, color: 'var(--color-ink-soft)' }}>{internal.message}</p>}
      </div>
    </div>
  );
}
