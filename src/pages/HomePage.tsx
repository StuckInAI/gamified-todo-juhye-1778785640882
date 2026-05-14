import { Link } from 'react-router-dom';
import { ListTodo, ShoppingBag, Sparkles, Coins } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Character from '@/components/character/Character';
import { useGame } from '@/hooks/useGame';
import { xpForNextLevel } from '@/lib/leveling';

export default function HomePage() {
  const { state } = useGame();
  const { character, tasks } = state;
  const need = xpForNextLevel(character.level);
  const pct = Math.min(100, Math.round((character.xp / need) * 100));
  const openTasks = tasks.filter((t) => !t.completed).length;
  const doneTasks = tasks.filter((t) => t.completed).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(220px, 1fr) 2fr',
          gap: 24,
          alignItems: 'center',
        }}
      >
        <Character size="md" showName />
        <Card tone="pink">
          <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 28 }}>
            Hi, I'm {character.name} 🌷
          </h1>
          <p style={{ marginTop: 8, color: 'var(--color-ink-soft)' }}>
            Welcome back! Let's tend to your quests together.
          </p>
          <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
            <Stat label="Level" value={`Lv ${character.level}`} icon={<Sparkles size={16} />} />
            <Stat label="Coins" value={character.coins} icon={<Coins size={16} />} />
            <Stat label="Open quests" value={openTasks} icon={<ListTodo size={16} />} />
            <Stat label="Completed" value={doneTasks} icon={<Sparkles size={16} />} />
          </div>
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-ink-soft)' }}>
              XP {character.xp} / {need}
            </div>
            <div
              style={{
                marginTop: 6,
                height: 10,
                width: '100%',
                background: 'rgba(255,255,255,0.7)',
                borderRadius: 999,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${pct}%`,
                  height: '100%',
                  background:
                    'linear-gradient(90deg, var(--color-lavender-deep), var(--color-pink-deep))',
                  borderRadius: 999,
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
            <Link to="/tasks">
              <Button>
                <ListTodo size={18} /> Go to Tasks
              </Button>
            </Link>
            <Link to="/shop">
              <Button variant="secondary">
                <ShoppingBag size={18} /> Visit Shop
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.7)',
        padding: '8px 14px',
        borderRadius: 12,
        minWidth: 100,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 12,
          fontWeight: 700,
          color: 'var(--color-ink-soft)',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        }}
      >
        {icon}
        {label}
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20 }}>{value}</div>
    </div>
  );
}
