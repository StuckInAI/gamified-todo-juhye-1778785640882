import { useState } from 'react';
import { Coins, Check, Lock } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useGame } from '@/hooks/useGame';
import { useToast } from '@/hooks/useToast';
import { SHOP_ITEMS } from '@/lib/shopItems';
import type { ItemCategory } from '@/types';
import clsx from 'clsx';
import styles from './ShopPage.module.css';

const CATEGORIES: { key: ItemCategory | 'all'; label: string; emoji: string }[] = [
  { key: 'all', label: 'All', emoji: '✨' },
  { key: 'hat', label: 'Hats', emoji: '🎩' },
  { key: 'outfit', label: 'Outfits', emoji: '👕' },
  { key: 'accessory', label: 'Accessories', emoji: '🎒' },
  { key: 'decoration', label: 'Decor', emoji: '🪴' },
];

export default function ShopPage() {
  const { state, buyItem } = useGame();
  const { showToast } = useToast();
  const [filter, setFilter] = useState<ItemCategory | 'all'>('all');

  const items = SHOP_ITEMS.filter((i) => filter === 'all' || i.category === filter);

  const handleBuy = (id: string, name: string, price: number) => {
    const res = buyItem(id);
    if (res.ok) {
      showToast({
        emoji: '🎉',
        title: `Got ${name}!`,
        message: `Spent ${price} coins. It's now equipped 💛`,
      });
    } else {
      showToast({
        emoji: '💭',
        title: 'Hmm…',
        message: res.reason,
      });
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>🛍️ Cozy Shop</h1>
          <p className={styles.subtitle}>Spend your hard-earned coins on tiny joys.</p>
        </div>
        <div className={styles.coins}>
          <Coins size={18} />
          <strong>{state.character.coins}</strong> coins
        </div>
      </header>

      <div className={styles.tabs}>
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => setFilter(c.key)}
            className={clsx(styles.tab, filter === c.key && styles.tabActive)}
          >
            <span>{c.emoji}</span>
            <span>{c.label}</span>
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {items.map((item) => {
          const owned = state.character.ownedItems.includes(item.id);
          const canAfford = state.character.coins >= item.price;
          return (
            <Card key={item.id} className={styles.item}>
              <div className={styles.emoji}>{item.emoji}</div>
              <h3 className={styles.itemName}>{item.name}</h3>
              <p className={styles.itemDesc}>{item.description}</p>
              <div className={styles.itemFoot}>
                <span className={styles.price}>
                  <Coins size={14} />
                  {item.price}
                </span>
                {owned ? (
                  <Button size="sm" variant="ghost" disabled>
                    <Check size={14} /> Owned
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant={canAfford ? 'primary' : 'ghost'}
                    disabled={!canAfford}
                    onClick={() => handleBuy(item.id, item.name, item.price)}
                  >
                    {canAfford ? 'Buy' : (<><Lock size={14} /> Locked</>)}
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
