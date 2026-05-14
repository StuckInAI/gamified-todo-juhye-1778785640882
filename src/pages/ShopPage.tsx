import { useMemo, useState } from 'react';
import { Coins, Check, Sparkles } from 'lucide-react';
import { useGame } from '@/hooks/useGame';
import { SHOP_ITEMS } from '@/lib/shopItems';
import type { ShopItem } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import CharacterAvatar from '@/components/character/CharacterAvatar';
import { useToast } from '@/hooks/useToast';
import clsx from 'clsx';
import styles from './ShopPage.module.css';

type Category = 'all' | ShopItem['category'];

export default function ShopPage() {
  const { state, buyItem, equipItem } = useGame();
  const { character } = state;
  const { showToast } = useToast();
  const [category, setCategory] = useState<Category>('all');

  const items = useMemo(() => {
    if (category === 'all') return SHOP_ITEMS;
    return SHOP_ITEMS.filter((i) => i.category === category);
  }, [category]);

  const owned = (id: string) => character.ownedItemIds.includes(id);
  const equipped = (item: ShopItem) => character.equipped[item.category] === item.id;

  const handleAction = (item: ShopItem) => {
    if (!owned(item.id)) {
      if (character.coins < item.price) {
        showToast?.("Not enough coins yet — keep questing! 🌱", 'info');
        return;
      }
      buyItem(item.id);
      showToast?.(`Got ${item.name}! ✨`, 'success');
      return;
    }
    equipItem?.(item.id);
    showToast?.(`Equipped ${item.name} 💖`, 'success');
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Cozy Shop 🛍️</h1>
          <p className={styles.subtitle}>Spend coins on adorable cosmetics for your character.</p>
        </div>
        <div className={styles.preview}>
          <CharacterAvatar size="sm" />
          <div className={styles.coins}>
            <Coins size={16} />
            <span>{character.coins}</span>
          </div>
        </div>
      </div>

      <div className={styles.filters}>
        {(['all', 'hat', 'outfit', 'accessory', 'decoration'] as Category[]).map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={clsx(styles.filter, category === c && styles.filterActive)}
          >
            {c === 'all' ? '✨ All' : c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {items.map((item) => {
          const isOwned = owned(item.id);
          const isEquipped = equipped(item);
          const canAfford = character.coins >= item.price;
          return (
            <Card key={item.id} className={styles.itemCard}>
              <div className={styles.itemEmoji}>{item.emoji}</div>
              <h3 className={styles.itemName}>{item.name}</h3>
              <p className={styles.itemDesc}>{item.description ?? ''}</p>
              <div className={styles.itemFooter}>
                {!isOwned ? (
                  <span className={clsx(styles.price, !canAfford && styles.priceLow)}>
                    <Coins size={14} /> {item.price}
                  </span>
                ) : isEquipped ? (
                  <span className={styles.equipped}>
                    <Check size={14} /> Equipped
                  </span>
                ) : (
                  <span className={styles.ownedBadge}>
                    <Sparkles size={14} /> Owned
                  </span>
                )}
                <Button
                  size="sm"
                  variant={isEquipped ? 'ghost' : isOwned ? 'secondary' : 'primary'}
                  disabled={!isOwned && !canAfford}
                  onClick={() => handleAction(item)}
                >
                  {isEquipped ? 'Equipped' : isOwned ? 'Equip' : 'Buy'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
