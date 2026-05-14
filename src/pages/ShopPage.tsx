import { useMemo } from 'react';
import { Coins, Check, Sparkles } from 'lucide-react';
import { useGame } from '@/hooks/useGame';
import { useToast } from '@/hooks/useToast';
import { SHOP_ITEMS } from '@/lib/shopItems';
import type { ShopItem } from '@/types';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import styles from './ShopPage.module.css';
import clsx from 'clsx';

export default function ShopPage() {
  const { state, buyItem, equipItem } = useGame();
  const { character } = state;
  const { showToast } = useToast();
  const owned = useMemo(() => new Set(character.ownedItems), [character.ownedItems]);

  const categories = useMemo(() => {
    const map = new Map<string, ShopItem[]>();
    for (const item of SHOP_ITEMS) {
      if (!map.has(item.category)) map.set(item.category, []);
      map.get(item.category)!.push(item);
    }
    return Array.from(map.entries());
  }, []);

  const handleBuy = (item: ShopItem) => {
    if (character.coins < item.price) {
      showToast({
        emoji: '💸',
        title: 'Not enough coins',
        message: `You need ${item.price - character.coins} more coins for ${item.name}.`,
      });
      return;
    }
    const ok = buyItem(item.id);
    if (ok) {
      showToast({
        emoji: '🛍️',
        title: 'Purchased!',
        message: `You bought ${item.emoji} ${item.name}!`,
      });
    }
  };

  const handleEquip = (item: ShopItem) => {
    equipItem(item.id);
    showToast({
      emoji: '✨',
      title: 'Equipped',
      message: `Equipped ${item.emoji} ${item.name}!`,
    });
  };

  const isEquipped = (item: ShopItem) => {
    return character.equipped[item.category] === item.id;
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>🛍️ Cozy Shop</h1>
          <p className={styles.subtitle}>Spend your hard-earned coins on adorable accessories.</p>
        </div>
        <div className={styles.coinsDisplay}>
          <Coins size={20} />
          <span>{character.coins}</span>
        </div>
      </div>

      {categories.map(([category, items]) => (
        <section key={category} className={styles.section}>
          <h2 className={styles.sectionTitle}>
            {categoryEmoji(category)} {categoryLabel(category)}
          </h2>
          <div className={styles.grid}>
            {items.map((item) => {
              const isOwned = owned.has(item.id);
              const equipped = isEquipped(item);
              return (
                <Card key={item.id} variant="plain" className={clsx(styles.card, equipped && styles.cardEquipped)}>
                  <div className={styles.itemEmoji}>{item.emoji}</div>
                  <div className={styles.itemName}>{item.name}</div>
                  {item.description && <div className={styles.itemDesc}>{item.description}</div>}
                  <div className={styles.itemFooter}>
                    {isOwned ? (
                      equipped ? (
                        <span className={styles.equippedBadge}>
                          <Check size={14} /> Equipped
                        </span>
                      ) : (
                        <Button size="sm" variant="secondary" onClick={() => handleEquip(item)}>
                          <Sparkles size={14} /> Equip
                        </Button>
                      )
                    ) : (
                      <>
                        <span className={styles.price}>
                          <Coins size={14} /> {item.price}
                        </span>
                        <Button
                          size="sm"
                          onClick={() => handleBuy(item)}
                          disabled={character.coins < item.price}
                        >
                          Buy
                        </Button>
                      </>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

function categoryEmoji(category: string) {
  switch (category) {
    case 'hat': return '🎩';
    case 'outfit': return '👕';
    case 'accessory': return '🎀';
    case 'decoration': return '🌸';
    default: return '✨';
  }
}

function categoryLabel(category: string) {
  return category.charAt(0).toUpperCase() + category.slice(1) + 's';
}
