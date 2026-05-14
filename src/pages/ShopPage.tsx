import { useMemo } from 'react';
import { Coins, Check, Sparkles } from 'lucide-react';
import { useGame } from '@/hooks/useGame';
import { useToast } from '@/hooks/useToast';
import { SHOP_ITEMS } from '@/lib/shopItems';
import type { ShopItem } from '@/types';
import Button from '@/components/ui/Button';
import CharacterAvatar from '@/components/character/CharacterAvatar';
import styles from './ShopPage.module.css';
import clsx from 'clsx';

const CATEGORIES: Array<{ key: ShopItem['category']; label: string; emoji: string }> = [
  { key: 'hat', label: 'Hats', emoji: '🎩' },
  { key: 'outfit', label: 'Outfits', emoji: '👗' },
  { key: 'accessory', label: 'Accessories', emoji: '🎀' },
  { key: 'decoration', label: 'Decorations', emoji: '🌸' },
];

export default function ShopPage() {
  const { state, buyItem, equipItem } = useGame();
  const { character } = state;
  const showToast = useToast();

  const grouped = useMemo(() => {
    return CATEGORIES.map((cat) => ({
      ...cat,
      items: SHOP_ITEMS.filter((i) => i.category === cat.key),
    }));
  }, []);

  const owned = (id: string) => character.ownedItems.includes(id);
  const equipped = (item: ShopItem) => character.equipped[item.category] === item.id;

  const handleBuy = (item: ShopItem) => {
    if (character.coins < item.price) {
      showToast?.("Not enough coins yet — keep questing! 🌱");
      return;
    }
    buyItem(item.id);
    showToast?.(`Got ${item.name}! ✨`);
  };

  const handleEquip = (item: ShopItem) => {
    equipItem(item.category, item.id);
    showToast?.(`Equipped ${item.name} 💖`);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>🛍️ Cozy Shop</h1>
          <p className={styles.subtitle}>Spend your hard-earned coins on cute things for your character.</p>
        </div>
        <div className={styles.coinBalance}>
          <Coins size={20} />
          <span>{character.coins}</span>
        </div>
      </header>

      <div className={styles.layout}>
        <aside className={styles.previewCard}>
          <CharacterAvatar size="md" showName />
          <p className={styles.previewHint}>Your cozy companion 💛</p>
        </aside>

        <div className={styles.catalog}>
          {grouped.map((cat) => (
            <section key={cat.key} className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span>{cat.emoji}</span> {cat.label}
              </h2>
              <div className={styles.grid}>
                {cat.items.map((item) => {
                  const isOwned = owned(item.id);
                  const isEquipped = equipped(item);
                  return (
                    <div key={item.id} className={clsx(styles.itemCard, isEquipped && styles.itemEquipped)}>
                      <div className={styles.itemEmoji}>{item.emoji}</div>
                      <div className={styles.itemName}>{item.name}</div>
                      <div className={styles.itemPrice}>
                        <Coins size={13} />
                        <span>{item.price}</span>
                      </div>
                      {isOwned ? (
                        <Button
                          size="sm"
                          variant={isEquipped ? 'secondary' : 'ghost'}
                          onClick={() => handleEquip(item)}
                          disabled={isEquipped}
                        >
                          {isEquipped ? (
                            <>
                              <Check size={14} /> Equipped
                            </>
                          ) : (
                            <>
                              <Sparkles size={14} /> Equip
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => handleBuy(item)} disabled={character.coins < item.price}>
                          Buy
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
