import { useState } from 'react';
import { ShoppingBag, Coins, Check } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Character from '@/components/character/Character';
import { useGame } from '@/hooks/useGame';
import { SHOP_ITEMS } from '@/lib/shopItems';
import { useToast } from '@/hooks/useToast';
import clsx from 'clsx';
import styles from './ShopPage.module.css';

const CATEGORIES = [
  { id: 'all', label: 'All', emoji: '✨' },
  { id: 'hat', label: 'Hats', emoji: '🎩' },
  { id: 'outfit', label: 'Outfits', emoji: '👗' },
  { id: 'accessory', label: 'Accessories', emoji: '🎒' },
  { id: 'decoration', label: 'Decorations', emoji: '🌸' },
] as const;

export default function ShopPage() {
  const { state, buyItem } = useGame();
  const { push } = useToast();
  const [filter, setFilter] = useState<string>('all');

  const items = filter === 'all' ? SHOP_ITEMS : SHOP_ITEMS.filter((i) => i.category === filter);

  const handleBuy = (id: string) => {
    const res = buyItem(id);
    if (res.ok) {
      const item = SHOP_ITEMS.find((i) => i.id === id);
      push({
        emoji: item?.emoji ?? '🎁',
        title: 'Purchased!',
        message: `${item?.name ?? 'Item'} is now yours.`,
      });
    } else {
      push({
        emoji: '💸',
        title: 'Could not buy',
        message: res.reason,
      });
    }
  };

  return (
    <div className={styles.page}>
      <Card tone="lavender">
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>
              <ShoppingBag size={26} /> Cozy Shop
            </h1>
            <p className={styles.subtitle}>Earn coins by completing tasks, then treat your character ✨</p>
          </div>
          <div className={styles.coinBig}>
            <Coins size={20} />
            <span>{state.character.coins}</span>
          </div>
        </div>
      </Card>

      <div className={styles.layout}>
        <aside className={styles.preview}>
          <Character size="md" showName />
        </aside>

        <div className={styles.shopArea}>
          <div className={styles.filters}>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setFilter(c.id)}
                className={clsx(styles.filterBtn, filter === c.id && styles.filterBtnActive)}
              >
                <span>{c.emoji}</span> {c.label}
              </button>
            ))}
          </div>

          <div className={styles.grid}>
            {items.map((item) => {
              const owned = state.character.ownedItems.includes(item.id);
              const canAfford = state.character.coins >= item.price;
              return (
                <Card key={item.id} className={styles.itemCard}>
                  <div className={styles.itemEmoji}>{item.emoji}</div>
                  <div className={styles.itemName}>{item.name}</div>
                  <div className={styles.itemPrice}>
                    <Coins size={14} /> {item.price}
                  </div>
                  {owned ? (
                    <Button variant="secondary" size="sm" disabled>
                      <Check size={14} /> Owned
                    </Button>
                  ) : (
                    <Button size="sm" disabled={!canAfford} onClick={() => handleBuy(item.id)}>
                      Buy
                    </Button>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
