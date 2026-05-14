import { NavLink } from 'react-router-dom';
import { Home, ListTodo, ShoppingBag, Shirt, Coins, Sparkles } from 'lucide-react';
import { useGame } from '@/hooks/useGame';
import { xpForNextLevel } from '@/lib/leveling';
import styles from './Header.module.css';
import clsx from 'clsx';

export default function Header() {
  const { state } = useGame();
  const { character } = state;
  const need = xpForNextLevel(character.level);
  const pct = Math.min(100, Math.round((character.xp / need) * 100));

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <NavLink to="/" className={styles.brand}>
          <span className={styles.brandEmoji}>🌷</span>
          <span>Cozy Quest</span>
        </NavLink>

        <nav className={styles.nav}>
          <NavItem to="/" icon={<Home size={18} />} label="Home" />
          <NavItem to="/tasks" icon={<ListTodo size={18} />} label="Tasks" />
          <NavItem to="/shop" icon={<ShoppingBag size={18} />} label="Shop" />
          <NavItem to="/wardrobe" icon={<Shirt size={18} />} label="Wardrobe" />
        </nav>

        <div className={styles.stats}>
          <div className={styles.levelChip}>
            <Sparkles size={14} />
            <span>Lv {character.level}</span>
            <div className={styles.xpBar}>
              <div className={styles.xpFill} style={{ width: `${pct}%` }} />
            </div>
          </div>
          <div className={styles.coinChip}>
            <Coins size={16} />
            <span>{character.coins}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) => clsx(styles.navItem, isActive && styles.navItemActive)}
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}
