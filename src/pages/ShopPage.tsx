import { useState } from 'react';
import { ShoppingBag, Coins, Check, Sparkles } from 'lucide-react';
import { useGame } from '@/hooks/useGame';
import { useToast } from '@/hooks/useToast';
import { SHOP_ITEMS } from '@/lib/shopItems';
import type { ShopItem } from '@/types';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import styles from './ShopPage.module.css';
import clsx from 'clsx';

type Category = 'all' | 'hat' | 'outfit' | 'accessory' | 'decoration';

export default function ShopPage() {
  const { state, buyItem, equipItem } = useGame();
  const { character } = state;
  const showToast = useToast()?.showToast;
  const [category, setCategory] = useState<Category>('all');

  const items = SHOP_ITEMS.filter((item) => category === 'all' || item.category === category);

  const owned = character.ownedItems ?? [];

  const handleBuy = (item: ShopItem) => {
    if (character.coins < item.price) {
      showToast?.({
        title: 'Not enough coins',
        message: 'Not enough coins yet — keep questing! 🌱',
        variant: 'info',
      });
      return;
    }
    const success = buyItem(item.id);
    if (success) {
      showToast?.({
        title: `Got ${item.name}! ✨`,
        variant: 'success',
      });
    }
  };

  const handleEquip = (item: ShopItem) => {
    equipItem(item.id);
    showToast?.({
      title: `Equipped ${item.name} 💖`,
      variant: 'success',
    });
  };

  const categories: { key: Category; label: string; emoji: string }[] = [
    { key: 'all', label: 'All', emoji: '✨' },
    { key: 'hat', label: 'Hats', emoji: '🎩' },
    { key: 'outfit', label: 'Outfits', emoji: '👕' },
    { key: 'accessory', label: 'Accessories', emoji: '🎀' },
    { key: 'decoration', label: 'Decor', emoji: '🌼' },
  ];

  return (
    <div className={styles.page}>
      <Card>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>
              <ShoppingBag size={22} /> Cozy Shop
            </h1>
            <p className={styles.subtitle}>Spend your hard-earned coins on cute things 💕</p>
          </div>
          <div className={styles.coinBalance}>
            <Coins size={18} />
            <span>{character.coins} coins</span>
          </div>
        </div>

        <div className={styles.tabs}>
          {categories.map((c) => (
            <button
              key={c.key}
              className={clsx(styles.tab, category === c.key && styles.tabActive)}
              onClick={() => setCategory(c.key)}
            >
              <span>{c.emoji}</span>
              <span>{c.label}</span>
            </button>
          ))}
        </div>
      </Card>

      <div className={styles.grid}>
        {items.map((item) => {
          const isOwned = owned.includes(item.id);
          const isEquipped =
            character.equipped[item.category as keyof typeof character.equipped] === item.id;
          const canAfford = character.coins >= item.price;

          return (
            <Card key={item.id} className={styles.itemCard}>
              <div className={styles.itemEmoji}>{item.emoji}</div>
              <div className={styles.itemName}>{item.name}</div>
              {item.description && <div className={styles.itemDesc}>{item.description}</div>}
              <div className={styles.itemFooter}>
                {!isOwned ? (
                  <>
                    <span className={styles.price}>
                      <Coins size={14} /> {item.price}
                    </span>
                    <Button size="sm" onClick={() => handleBuy(item)} disabled={!canAfford}>
                      Buy
                    </Button>
                  </>
                ) : isEquipped ? (
                  <span className={styles.equipped}>
                    <Check size={14} /> Equipped
                  </span>
                ) : (
                  <Button size="sm" variant="secondary" onClick={() => handleEquip(item)}>
                    <Sparkles size={14} /> Equip
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
