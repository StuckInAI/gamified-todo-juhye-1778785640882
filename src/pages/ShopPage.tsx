import { useMemo, useState } from 'react';
import { Coins, Check, Lock } from 'lucide-react';
import { useGame } from '@/hooks/useGame';
import { useToast } from '@/hooks/useToast';
import { SHOP_ITEMS } from '@/lib/shopItems';
import type { ShopItem } from '@/types';
import Button from '@/components/ui/Button';
import Character from '@/components/character/Character';
import styles from './ShopPage.module.css';
import clsx from 'clsx';

type CategoryFilter = 'all' | ShopItem['category'];

const CATEGORIES: { value: CategoryFilter; label: string; emoji: string }[] = [
  { value: 'all', label: 'All', emoji: '✨' },
  { value: 'hat', label: 'Hats', emoji: '🎩' },
  { value: 'outfit', label: 'Outfits', emoji: '👗' },
  { value: 'accessory', label: 'Accessories', emoji: '🎀' },
  { value: 'decoration', label: 'Decorations', emoji: '🌸' },
];

export default function ShopPage() {
  const { state, dispatch } = useGame();
  const { showToast } = useToast();
  const [filter, setFilter] = useState<CategoryFilter>('all');

  const items = useMemo(() => {
    if (filter === 'all') return SHOP_ITEMS;
    return SHOP_ITEMS.filter((i) => i.category === filter);
  }, [filter]);

  const ownedIds = new Set(state.character.ownedItems);
  const equipped = state.character.equipped;

  const handlePurchase = (item: ShopItem) => {
    if (ownedIds.has(item.id)) {
      showToast({
        title: 'Already owned',
        message: `You already have ${item.name}!`,
      });
      return;
    }
    if (state.character.coins < item.price) {
      showToast({
        title: 'Not enough coins',
        message: `You need ${item.price - state.character.coins} more coins.`,
      });
      return;
    }
    dispatch({ type: 'PURCHASE_ITEM', itemId: item.id });
    showToast({
      title: `Purchased ${item.name}!`,
      message: `Enjoy your new ${item.category}! 💖`,
    });
  };

  const handleEquip = (item: ShopItem) => {
    dispatch({ type: 'EQUIP_ITEM', itemId: item.id });
  };

  const isEquipped = (item: ShopItem) => equipped[item.category] === item.id;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>🛍️ Cozy Shop</h1>
          <p className={styles.subtitle}>Spend your hard-earned coins on cute things ✨</p>
        </div>
        <div className={styles.coinBalance}>
          <Coins size={20} />
          <span>{state.character.coins}</span>
        </div>
      </div>

      <div className={styles.layout}>
        <aside className={styles.preview}>
          <Character size="md" showName />
          <p className={styles.previewHint}>Try things on by tapping Equip ✨</p>
        </aside>

        <div className={styles.shop}>
          <div className={styles.filters}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setFilter(cat.value)}
                className={clsx(styles.filterBtn, filter === cat.value && styles.filterBtnActive)}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          <div className={styles.grid}>
            {items.map((item) => {
              const owned = ownedIds.has(item.id);
              const equippedNow = isEquipped(item);
              const canAfford = state.character.coins >= item.price;
              return (
                <div key={item.id} className={clsx(styles.card, equippedNow && styles.cardEquipped)}>
                  <div className={styles.emoji}>{item.emoji}</div>
                  <div className={styles.name}>{item.name}</div>
                  <div className={styles.category}>{item.category}</div>
                  {owned ? (
                    <Button
                      size="sm"
                      variant={equippedNow ? 'secondary' : 'ghost'}
                      onClick={() => handleEquip(item)}
                    >
                      {equippedNow ? (
                        <>
                          <Check size={14} /> Equipped
                        </>
                      ) : (
                        'Equip'
                      )}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant={canAfford ? 'primary' : 'ghost'}
                      onClick={() => handlePurchase(item)}
                      disabled={!canAfford}
                    >
                      {canAfford ? <Coins size={14} /> : <Lock size={14} />}
                      {item.price}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
