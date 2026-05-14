import { useMemo } from 'react';
import { Coins, Check, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useGame } from '@/hooks/useGame';
import { useToast } from '@/hooks/useToast';
import { SHOP_ITEMS, getItemById } from '@/lib/shopItems';
import type { ShopItem } from '@/types';
import styles from './ShopPage.module.css';
import clsx from 'clsx';

export default function ShopPage() {
  const { state, buyItem, equipItem, unequipSlot } = useGame();
  const { character } = state;
  const { showToast } = useToast();

  const owned = useMemo(() => new Set(character.ownedItemIds), [character.ownedItemIds]);

  const categories: { key: ShopItem['category']; label: string; emoji: string }[] = [
    { key: 'hat', label: 'Hats', emoji: '🎩' },
    { key: 'outfit', label: 'Outfits', emoji: '👕' },
    { key: 'accessory', label: 'Accessories', emoji: '✨' },
    { key: 'decoration', label: 'Decorations', emoji: '🌷' },
  ];

  const handleBuy = (item: ShopItem) => {
    if (character.coins < item.price) {
      showToast({
        message: `You need ${item.price - character.coins} more coins for ${item.name}.`,
      });
      return;
    }
    const ok = buyItem(item.id);
    if (ok) {
      showToast({
        message: `You bought ${item.emoji} ${item.name}!`,
      });
    }
  };

  const handleEquip = (item: ShopItem) => {
    equipItem(item.id);
    showToast({
      message: `Equipped ${item.emoji} ${item.name}!`,
    });
  };

  const equippedInSlot = (slot: ShopItem['category']) => character.equipped[slot];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Cozy Shop 🛍️</h1>
          <p className={styles.subtitle}>Spend your hard-earned coins on adorable things.</p>
        </div>
        <div className={styles.coinBadge}>
          <Coins size={18} />
          <span>{character.coins}</span>
        </div>
      </header>

      {categories.map((cat) => {
        const items = SHOP_ITEMS.filter((i) => i.category === cat.key);
        if (items.length === 0) return null;
        const equippedId = equippedInSlot(cat.key);
        const equippedItem = equippedId ? getItemById(equippedId) : undefined;

        return (
          <section key={cat.key} className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span>{cat.emoji}</span> {cat.label}
              </h2>
              {equippedItem && (
                <button className={styles.unequipBtn} onClick={() => unequipSlot(cat.key)}>
                  Unequip {equippedItem.emoji}
                </button>
              )}
            </div>

            <div className={styles.grid}>
              {items.map((item) => {
                const isOwned = owned.has(item.id);
                const isEquipped = equippedId === item.id;
                const canAfford = character.coins >= item.price;

                return (
                  <div
                    key={item.id}
                    className={clsx(styles.card, isEquipped && styles.cardEquipped)}
                  >
                    <div className={styles.itemEmoji}>{item.emoji}</div>
                    <div className={styles.itemName}>{item.name}</div>
                    {item.description && <div className={styles.itemDesc}>{item.description}</div>}

                    <div className={styles.cardFooter}>
                      {isOwned ? (
                        isEquipped ? (
                          <span className={styles.equippedTag}>
                            <Check size={14} /> Equipped
                          </span>
                        ) : (
                          <Button size="sm" variant="secondary" onClick={() => handleEquip(item)}>
                            <Sparkles size={14} /> Equip
                          </Button>
                        )
                      ) : (
                        <Button
                          size="sm"
                          variant={canAfford ? 'primary' : 'ghost'}
                          onClick={() => handleBuy(item)}
                          disabled={!canAfford}
                        >
                          <Coins size={14} /> {item.price}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
