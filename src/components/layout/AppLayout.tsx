import { Outlet } from 'react-router-dom';
import Header from './Header';
import { ToastProvider } from '@/hooks/useToast';
import { useGame } from '@/hooks/useGame';
import { xpForNextLevel } from '@/lib/leveling';
import styles from './Layout.module.css';

export default function AppLayout() {
  const { state } = useGame();
  const { character } = state;
  // expose level progress for layout consumers if needed
  void xpForNextLevel(character.level);

  return (
    <ToastProvider>
      <div className={styles.shell}>
        <Header />
        <main className={styles.main}>
          <Outlet />
        </main>
        <footer className={styles.footer}>
          <span>made with 🌷 for cozy productivity</span>
        </footer>
      </div>
    </ToastProvider>
  );
}
