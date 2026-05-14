import { Link } from 'react-router-dom';
import { Coins, Trophy, ListTodo, ShoppingBag, Sparkles, Heart } from 'lucide-react';
import Character from '@/components/character/Character';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useGame } from '@/hooks/useGame';
import { xpForNextLevel } from '@/lib/leveling';
import styles from './HomePage.module.css';

export default function HomePage() {
  const { state, renameCharacter } = useGame();
  const { character, tasks } = state;

  const completedCount = tasks.filter((t) => t.completed).length;
  const openCount = tasks.length - completedCount;
  const need = xpForNextLevel(character.level);
  const xpPct = Math.min(100, Math.round((character.xp / need) * 100));

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 5) return 'Still up?';
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    if (h < 21) return 'Good evening';
    return 'Cozy night';
  })();

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <Card tone="pink" className={styles.greetCard}>
          <div className={styles.greetText}>
            <span className={styles.smallLabel}>{greeting}, friend</span>
            <h1>
              Welcome back,{' '}
              <input
                className={styles.nameInput}
                value={character.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => renameCharacter(e.target.value)}
              />
              !
            </h1>
            <p className={styles.tag}>
              <Heart size={14} fill="currentColor" /> Every tiny step counts. Pick one little quest today.
            </p>

            <div className={styles.quickActions}>
              <Link to="/tasks">
                <Button variant="primary">
                  <ListTodo size={16} /> Open my quests
                </Button>
              </Link>
              <Link to="/shop">
                <Button variant="ghost">
                  <ShoppingBag size={16} /> Visit the shop
                </Button>
              </Link>
            </div>
          </div>

          <div className={styles.charWrap}>
            <Character size="md" showName />
          </div>
        </Card>
      </div>

      <div className={styles.statGrid}>
        <Card tone="lavender">
          <div className={styles.stat}>
            <Trophy size={22} />
            <div>
              <div className={styles.statValue}>Level {character.level}</div>
              <div className={styles.statLabel}>
                {character.xp} / {need} XP
              </div>
              <div className={styles.statBar}>
                <div className={styles.statBarFill} style={{ width: `${xpPct}%` }} />
              </div>
            </div>
          </div>
        </Card>

        <Card tone="yellow">
          <div className={styles.stat}>
            <Coins size={22} />
            <div>
              <div className={styles.statValue}>{character.coins} coins</div>
              <div className={styles.statLabel}>save up for treasures ✨</div>
            </div>
          </div>
        </Card>

        <Card tone="mint">
          <div className={styles.stat}>
            <Sparkles size={22} />
            <div>
              <div className={styles.statValue}>
                {completedCount} done · {openCount} open
              </div>
              <div className={styles.statLabel}>
                {completedCount === 0 ? 'A fresh start awaits 🌷' : 'Look at you go! 🌟'}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className={styles.tipCard}>
        <h3>🌸 The Cozy Quest promise</h3>
        <ul className={styles.tipList}>
          <li>Every task has an <strong>official deadline</strong> AND a flexible <strong>grace period</strong> — no shame, just gentle nudges.</li>
          <li>Finish quests to earn <strong>XP</strong> and <strong>coins</strong>. Level up for bonus coins!</li>
          <li>Spend coins in the <strong>Shop</strong> to dress up your character and decorate their world.</li>
        </ul>
      </Card>
    </div>
  );
}
