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
  { key: 'accessory', label: 'Accessories', emoji: '🎀' },
  { key: 'decoration', label: 'Decorations', emoji: '🌸' },
];

export default function ShopPage() {
  const { state, buyItem, equipItem } = useGame();
  const { showToast } = useToast();
  const [filter, setFilter] = useState<ItemCategory | 'all'>('all');

  const { character } = state;
  const items = filter === 'all' ? SHOP_ITEMS : SHOP_ITEMS.filter((i) => i.category === filter);

  const handleBuy = (itemId: string, name: string) => {
    const res = buyItem(itemId);
    if (res.ok) {
      showToast({
        emoji: '🎉',
        title: 'Purchased!',
        message: `${name} is now yours and equipped.`,
      });
    } else {
      showToast({
        emoji: '😢',
        title: 'Could not buy',
        message: res.reason,
      });
    }
  };

  const handleEquip = (itemId: string, name: string) => {
    equipItem(itemId);
    showToast({
      emoji: '✨',
      title: 'Equipped!',
      message: `${name} looks great on you.`,
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Cozy Shop 🛍️</h1>
          <p className={styles.subtitle}>Spend your hard-earned coins on adorable accessories.</p>
        </div>
        <div className={styles.coins}>
          <Coins size={18} />
          <span>{character.coins}</span>
        </div>
      </div>

      <div className={styles.filters}>
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => setFilter(c.key)}
            className={clsx(styles.filterBtn, filter === c.key && styles.filterBtnActive)}
          >
            <span>{c.emoji}</span>
            <span>{c.label}</span>
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {items.map((item) => {
          const owned = character.ownedItems.includes(item.id);
          const equipped =
            character.equipped[item.category] === item.id;
          const canAfford = character.coins >= item.price;

          return (
            <Card key={item.id} className={styles.itemCard}>
              <div className={styles.itemEmoji}>{item.emoji}</div>
              <div className={styles.itemName}>{item.name}</div>
              <div className={styles.itemCategory}>{item.category}</div>
              <div className={styles.itemPrice}>
                <Coins size={14} />
                <span>{item.price}</span>
              </div>
              {owned ? (
                equipped ? (
                  <Button size="sm" variant="secondary" disabled>
                    <Check size={14} /> Equipped
                  </Button>
                ) : (
                  <Button size="sm" variant="ghost" onClick={() => handleEquip(item.id, item.name)}>
                    Equip
                  </Button>
                )
              ) : (
                <Button
                  size="sm"
                  variant={canAfford ? 'primary' : 'ghost'}
                  disabled={!canAfford}
                  onClick={() => handleBuy(item.id, item.name)}
                >
                  {canAfford ? 'Buy' : (<><Lock size={12} /> Locked</>)}
                </Button>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
