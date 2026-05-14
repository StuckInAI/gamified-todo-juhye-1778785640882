import { useState } from 'react';
import { Coins, Lock, Check } from 'lucide-react';
import { SHOP_ITEMS } from '@/lib/shopItems';
import type { ItemCategory } from '@/types';
import { useGame } from '@/hooks/useGame';
import { useToast } from '@/hooks/useToast';
import Character from '@/components/character/Character';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import clsx from 'clsx';
import styles from './ShopPage.module.css';

type Tab = 'all' | ItemCategory;

const TABS: { value: Tab; label: string; emoji: string }[] = [
  { value: 'all', label: 'All', emoji: '🛍️' },
  { value: 'hat', label: 'Hats', emoji: '🎩' },
  { value: 'outfit', label: 'Outfits', emoji: '👗' },
  { value: 'accessory', label: 'Accessories', emoji: '🎀' },
  { value: 'decoration', label: 'Decorations', emoji: '🪴' },
];

export default function ShopPage() {
  const [tab, setTab] = useState<Tab>('all');
  const { state, buyItem } = useGame();
  const { showToast } = useToast();
  const { character } = state;

  const items = SHOP_ITEMS.filter((i) => tab === 'all' || i.category === tab);

  const handleBuy = (id: string, name: string) => {
    const res = buyItem(id);
    if (res.ok) {
      showToast({
        emoji: '✨',
        title: 'New treasure!',
        message: `You got the ${name}. It's been equipped!`,
      });
    } else {
      showToast({
        emoji: '💭',
        title: 'Not yet',
        message: res.reason,
      });
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div>
          <h1 className={styles.title}>🍯 The Cozy Shop</h1>
          <p className={styles.sub}>Spend your hard-earned coins on something delightful.</p>
        </div>
        <Card tone="yellow" className={styles.purse}>
          <Coins size={20} />
          <span>{character.coins} coins</span>
        </Card>
      </div>

      <div className={styles.split}>
        <div className={styles.previewWrap}>
          <Card>
            <h3 className={styles.previewTitle}>You</h3>
            <Character size="md" showName />
          </Card>
        </div>

        <div className={styles.shopWrap}>
          <div className={styles.tabs}>
            {TABS.map((t) => (
              <button
                key={t.value}
                onClick={() => setTab(t.value)}
                className={clsx(styles.tab, tab === t.value && styles.tabActive)}
              >
                <span>{t.emoji}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          <div className={styles.grid}>
            {items.map((item) => {
              const owned = character.ownedItems.includes(item.id);
              const affordable = character.coins >= item.price;
              return (
                <div key={item.id} className={clsx(styles.item, styles[`rarity_${item.rarity}`])}>
                  <div className={styles.itemEmoji}>{item.emoji}</div>
                  <div className={styles.itemName}>{item.name}</div>
                  <div className={styles.itemDesc}>{item.description}</div>
                  <div className={styles.rarityBadge}>{item.rarity}</div>

                  {owned ? (
                    <Button variant="secondary" size="sm" disabled>
                      <Check size={14} /> Owned
                    </Button>
                  ) : (
                    <Button
                      variant={affordable ? 'primary' : 'ghost'}
                      size="sm"
                      disabled={!affordable}
                      onClick={() => handleBuy(item.id, item.name)}
                    >
                      {affordable ? <Coins size={14} /> : <Lock size={14} />}
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
