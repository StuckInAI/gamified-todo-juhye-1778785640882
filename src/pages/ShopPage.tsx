import { useState } from 'react';
import { Coins, Check, Lock, Sparkles } from 'lucide-react';
import { useGame } from '@/hooks/useGame';
import { useToast } from '@/hooks/useToast';
import { SHOP_ITEMS } from '@/lib/shopItems';
import type { ShopItem } from '@/types';
import styles from './ShopPage.module.css';
import clsx from 'clsx';

type Category = ShopItem['category'];

const CATEGORIES: { key: Category | 'all'; label: string; emoji: string }[] = [
  { key: 'all', label: 'All', emoji: '✨' },
  { key: 'hat', label: 'Hats', emoji: '🎩' },
  { key: 'outfit', label: 'Outfits', emoji: '👕' },
  { key: 'accessory', label: 'Accessories', emoji: '🎀' },
  { key: 'decoration', label: 'Decorations', emoji: '🌸' },
];

export default function ShopPage() {
  const { state, buyItem, equipItem } = useGame();
  const toast = useToast();
  const showToast = toast?.showToast;
  const { character } = state;
  const [filter, setFilter] = useState<Category | 'all'>('all');

  const items = filter === 'all' ? SHOP_ITEMS : SHOP_ITEMS.filter((i) => i.category === filter);

  const handleBuy = (item: ShopItem) => {
    if (character.coins < item.price) {
      showToast?.("Not enough coins yet — keep questing! 🌱");
      return;
    }
    const ok = buyItem(item.id);
    if (ok) {
      showToast?.(`Got ${item.name}! ✨`);
    }
  };

  const handleEquip = (item: ShopItem) => {
    equipItem(item.id);
    showToast?.(`Equipped ${item.name} 💖`);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>🛍️ Cozy Shop</h1>
          <p className={styles.subtitle}>Spend your hard-earned coins on adorable accessories.</p>
        </div>
        <div className={styles.coinBadge}>
          <Coins size={18} />
          <span>{character.coins}</span>
        </div>
      </header>

      <div className={styles.filters}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setFilter(cat.key)}
            className={clsx(styles.filterBtn, filter === cat.key && styles.filterBtnActive)}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {items.map((item) => {
          const owned = character.inventory.includes(item.id);
          const equipped = character.equipped[item.category] === item.id;
          const canAfford = character.coins >= item.price;

          return (
            <div key={item.id} className={clsx(styles.card, equipped && styles.cardEquipped)}>
              <div className={styles.itemEmoji}>{item.emoji}</div>
              <div className={styles.itemName}>{item.name}</div>
              <div className={styles.itemCategory}>{item.category}</div>

              {owned ? (
                <button
                  onClick={() => handleEquip(item)}
                  className={clsx(styles.actionBtn, equipped ? styles.equippedBtn : styles.equipBtn)}
                  disabled={equipped}
                >
                  {equipped ? (
                    <>
                      <Check size={14} /> Equipped
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} /> Equip
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => handleBuy(item)}
                  className={clsx(styles.actionBtn, styles.buyBtn, !canAfford && styles.buyBtnDisabled)}
                  disabled={!canAfford}
                >
                  {canAfford ? <Coins size={14} /> : <Lock size={14} />}
                  <span>{item.price}</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
