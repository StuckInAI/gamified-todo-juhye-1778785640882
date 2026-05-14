import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import styles from './useToast.module.css';

type Toast = {
  id: string;
  emoji: string;
  title: string;
  message?: string;
};

type ToastContextValue = {
  showToast: (t: Omit<Toast, 'id'>) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((t: Omit<Toast, 'id'>) => {
    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, ...t }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, 3200);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className={styles.stack}>
        {toasts.map((t) => (
          <div key={t.id} className={styles.toast}>
            <span className={styles.emoji}>{t.emoji}</span>
            <div>
              <div className={styles.title}>{t.title}</div>
              {t.message && <div className={styles.message}>{t.message}</div>}
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
