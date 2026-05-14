import { useState } from 'react';
import { useGame } from '@/hooks/useGame';
import { useToast } from '@/hooks/useToast';
import { SHOP_ITEMS } from '@/lib/shopItems';
import type { ShopItem } from '@/types';
import Button from '@/components/ui/Button';
import Character from '@/components/character/Character';
import { Coins, Check, Lock } from 'lucide-react';
import clsx from 'clsx';
import styles from './ShopPage.module.css';

type Category = 'all' | ShopItem['category'];

const CATEGORIES: { value: Category; label: string; emoji: string }[] = [
  { value: 'all', label: 'All', emoji: '🛍️' },
  { value: 'hat', label: 'Hats', emoji: '🎩' },
  { value: 'outfit', label: 'Outfits', emoji: '👕' },
  { value: 'accessory', label: 'Accessories', emoji: '✨' },
  { value: 'decoration', label: 'Decorations', emoji: '🌸' },
];

export default function ShopPage() {
  const { state, buyItem, equipItem } = useGame();
  const { showToast } = useToast();
  const [category, setCategory] = useState<Category>('all');

  const items = SHOP_ITEMS.filter((item) => category === 'all' || item.category === category);
  const ownedIds = new Set(state.character.ownedItems);

  const handleBuy = (item: ShopItem) => {
    if (ownedIds.has(item.id)) {
      // already owned -> equip instead
      equipItem?.(item);
      showToast({
        title: `Equipped ${item.name}`,
        message: `Looking cute! 💖`,
        emoji: item.emoji,
      });
      return;
    }

    if (state.character.coins < item.price) {
      showToast({
        title: 'Not enough coins',
        message: `You need ${item.price - state.character.coins} more coins.`,
        emoji: '🪙',
      });
      return;
    }

    buyItem(item);
    showToast({
      title: `Purchased ${item.name}!`,
      message: `Enjoy your new ${item.category}! 💖`,
      emoji: item.emoji,
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Cozy Shop 🛍️</h1>
          <p className={styles.subtitle}>Spend your hard-earned coins on something delightful.</p>
        </div>
        <div className={styles.coinDisplay}>
          <Coins size={20} />
          <span>{state.character.coins}</span>
        </div>
      </div>

      <div className={styles.layout}>
        <aside className={styles.preview}>
          <Character size="md" showName />
        </aside>

        <div className={styles.main}>
          <div className={styles.categories}>
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={clsx(styles.catBtn, category === c.value && styles.catBtnActive)}
              >
                <span>{c.emoji}</span>
                <span>{c.label}</span>
              </button>
            ))}
          </div>

          <div className={styles.grid}>
            {items.map((item) => {
              const owned = ownedIds.has(item.id);
              const canAfford = state.character.coins >= item.price;
              return (
                <div key={item.id} className={clsx(styles.card, owned && styles.cardOwned)}>
                  <div className={styles.itemEmoji}>{item.emoji}</div>
                  <div className={styles.itemName}>{item.name}</div>
                  <div className={styles.itemCategory}>{item.category}</div>
                  <div className={styles.itemPrice}>
                    <Coins size={14} />
                    <span>{item.price}</span>
                  </div>
                  <Button
                    size="sm"
                    variant={owned ? 'secondary' : 'primary'}
                    onClick={() => handleBuy(item)}
                    disabled={!owned && !canAfford}
                  >
                    {owned ? (
                      <>
                        <Check size={14} /> Equip
                      </>
                    ) : canAfford ? (
                      <>Buy</>
                    ) : (
                      <>
                        <Lock size={14} /> Locked
                      </>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
