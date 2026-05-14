import { Link } from 'react-router-dom';
import { ListTodo, ShoppingBag, Shirt, Sparkles, Coins } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Character from '@/components/character/Character';
import { useGame } from '@/hooks/useGame';
import { xpForNextLevel } from '@/lib/leveling';
import styles from './HomePage.module.css';

export default function HomePage() {
  const { state } = useGame();
  const { character, tasks } = state;

  const openTasks = tasks.filter((t) => !t.completed);
  const doneToday = tasks.filter(
    (t) => t.completed && t.completedAt && isToday(t.completedAt)
  ).length;

  const need = xpForNextLevel(character.level);
  const pct = Math.min(100, Math.round((character.xp / need) * 100));

  return (
    <div className={styles.page}>
      <Card tone="pink" className={styles.hero}>
        <div className={styles.heroLeft}>
          <h1 className={styles.greeting}>
            Hi, {character.name}! <span>🌸</span>
          </h1>
          <p className={styles.subtitle}>
            Tiny steps, cozy wins. Let's make today gentle and productive.
          </p>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <Sparkles size={16} />
              <span>
                Level <strong>{character.level}</strong>
              </span>
              <div className={styles.xpBar}>
                <div className={styles.xpFill} style={{ width: `${pct}%` }} />
              </div>
              <small>
                {character.xp}/{need} XP
              </small>
            </div>
            <div className={styles.stat}>
              <Coins size={16} />
              <strong>{character.coins}</strong> coins
            </div>
          </div>
          <div className={styles.heroActions}>
            <Link to="/tasks">
              <Button>
                <ListTodo size={16} /> Open tasks
              </Button>
            </Link>
            <Link to="/shop">
              <Button variant="secondary">
                <ShoppingBag size={16} /> Visit shop
              </Button>
            </Link>
          </div>
        </div>
        <div className={styles.heroRight}>
          <Character size="md" showName />
        </div>
      </Card>

      <div className={styles.grid}>
        <Card tone="mint">
          <h3 className={styles.cardTitle}>🌿 Today</h3>
          <p className={styles.cardBig}>{doneToday}</p>
          <p className={styles.cardSmall}>tasks completed</p>
        </Card>
        <Card tone="sky">
          <h3 className={styles.cardTitle}>📋 Open quests</h3>
          <p className={styles.cardBig}>{openTasks.length}</p>
          <p className={styles.cardSmall}>waiting for you</p>
        </Card>
        <Card tone="lavender">
          <h3 className={styles.cardTitle}>🧺 Wardrobe</h3>
          <p className={styles.cardBig}>{character.ownedItems.length}</p>
          <p className={styles.cardSmall}>items owned</p>
          <Link to="/wardrobe" className={styles.cardLink}>
            <Shirt size={14} /> Dress up
          </Link>
        </Card>
      </div>

      {openTasks.length > 0 && (
        <Card className={styles.next}>
          <h3 className={styles.cardTitle}>✨ Up next</h3>
          <ul className={styles.nextList}>
            {openTasks.slice(0, 3).map((t) => (
              <li key={t.id} className={styles.nextItem}>
                <span>
                  {t.difficulty === 'small' ? '🌱' : t.difficulty === 'medium' ? '🌿' : '🌳'}
                </span>
                <span>{t.title}</span>
              </li>
            ))}
          </ul>
          <Link to="/tasks">
            <Button variant="ghost" size="sm">
              See all tasks →
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
}

function isToday(ts: number): boolean {
  const d = new Date(ts);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}
