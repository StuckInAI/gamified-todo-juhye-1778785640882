import { useState } from 'react';
import { Coins, Check, Sparkles } from 'lucide-react';
import { useGame } from '@/hooks/useGame';
import { SHOP_ITEMS } from '@/lib/shopItems';
import type { ShopItem } from '@/types';
import Button from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';
import styles from './ShopPage.module.css';
import clsx from 'clsx';

type Category = ShopItem['category'] | 'all';

const CATEGORIES: { value: Category; label: string; emoji: string }[] = [
  { value: 'all', label: 'All', emoji: '✨' },
  { value: 'hat', label: 'Hats', emoji: '🎩' },
  { value: 'outfit', label: 'Outfits', emoji: '👕' },
  { value: 'accessory', label: 'Accessories', emoji: '🎀' },
  { value: 'decoration', label: 'Decorations', emoji: '🌸' },
];

export default function ShopPage() {
  const { state, purchaseItem, equipItem } = useGame();
  const { character } = state;
  const { showToast } = useToast();
  const [category, setCategory] = useState<Category>('all');

  const items = category === 'all' ? SHOP_ITEMS : SHOP_ITEMS.filter((i) => i.category === category);

  const handleBuy = (item: ShopItem) => {
    const res = purchaseItem(item.id);
    if (res.ok) {
      showToast({
        title: `${item.emoji} ${item.name} acquired!`,
        message: `Tap to equip it from your wardrobe.`,
        tone: 'success',
      });
    } else {
      showToast({
        title: `Can't buy ${item.name}`,
        message: res.reason,
        tone: 'warning',
      });
    }
  };

  const handleEquip = (item: ShopItem) => {
    equipItem(item.id);
    showToast({
      title: `${item.emoji} ${item.name} equipped!`,
      tone: 'success',
    });
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>
            <Sparkles size={22} /> Cozy Shop
          </h1>
          <p className={styles.subtitle}>
            Spend your hard-earned coins on cute things for your character.
          </p>
        </div>
        <div className={styles.coinDisplay}>
          <Coins size={20} />
          <span>{character.coins} coins</span>
        </div>
      </header>

      <div className={styles.tabs}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={clsx(styles.tab, category === cat.value && styles.tabActive)}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {items.map((item) => {
          const owned = character.ownedItems.includes(item.id);
          const equipped = character.equipped[item.category] === item.id;
          const canAfford = character.coins >= item.price;

          return (
            <div key={item.id} className={clsx(styles.card, equipped && styles.cardEquipped)}>
              <div className={styles.emoji}>{item.emoji}</div>
              <div className={styles.name}>{item.name}</div>
              {item.description && <div className={styles.desc}>{item.description}</div>}
              <div className={styles.priceRow}>
                <span className={styles.price}>
                  <Coins size={14} />
                  {item.price}
                </span>
              </div>
              {owned ? (
                equipped ? (
                  <Button variant="secondary" size="sm" disabled>
                    <Check size={14} /> Equipped
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => handleEquip(item)}>
                    Equip
                  </Button>
                )
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  disabled={!canAfford}
                  onClick={() => handleBuy(item)}
                >
                  {canAfford ? 'Buy' : 'Not enough'}
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
