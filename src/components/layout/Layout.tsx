import { Outlet } from 'react-router-dom';
import Header from './Header';
import { ToastProvider } from '@/hooks/useToast';
import styles from './Layout.module.css';

export default function Layout() {
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
