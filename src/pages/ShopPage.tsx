import { useMemo, useState } from 'react';
import { Coins, Check, ShoppingBag } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Character from '@/components/character/Character';
import { useGame } from '@/hooks/useGame';
import { useToast } from '@/hooks/useToast';
import { SHOP_ITEMS } from '@/lib/shopItems';
import type { ItemCategory } from '@/types';

const CATEGORIES: { key: ItemCategory | 'all'; label: string; emoji: string }[] = [
  { key: 'all', label: 'All', emoji: '✨' },
  { key: 'hat', label: 'Hats', emoji: '🎩' },
  { key: 'outfit', label: 'Outfits', emoji: '👕' },
  { key: 'accessory', label: 'Accessories', emoji: '🎀' },
  { key: 'decoration', label: 'Scenery', emoji: '🌳' },
];

export default function ShopPage() {
  const { state, buyItem, equipItem } = useGame();
  const { showToast } = useToast();
  const [filter, setFilter] = useState<ItemCategory | 'all'>('all');

  const items = useMemo(() => {
    if (filter === 'all') return SHOP_ITEMS;
    return SHOP_ITEMS.filter((i) => i.category === filter);
  }, [filter]);

  const handleBuy = (id: string) => {
    const res = buyItem(id);
    if (res.ok) {
      showToast({ emoji: '🛍️', title: 'Purchased & equipped!', message: 'Looking cozy 💕' });
    } else {
      showToast({
        emoji: '😿',
        title: 'Could not buy',
        message: res.reason,
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 28 }}>
            <ShoppingBag size={26} style={{ verticalAlign: '-4px' }} /> Cozy Shop
          </h1>
          <p style={{ marginTop: 6, color: 'var(--color-ink-soft)' }}>
            Spend coins on cute things for {state.character.name}.
          </p>
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 14px',
            background: 'var(--color-yellow)',
            borderRadius: 999,
            fontWeight: 700,
          }}
        >
          <Coins size={18} />
          {state.character.coins} coins
        </div>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(200px, 280px) 1fr',
          gap: 24,
          alignItems: 'start',
        }}
      >
        <Character size="md" showName />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                onClick={() => setFilter(c.key)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 999,
                  border: '2px solid var(--color-cream-2)',
                  background: filter === c.key ? 'var(--color-pink)' : 'white',
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                {c.emoji} {c.label}
              </button>
            ))}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: 14,
            }}
          >
            {items.map((item) => {
              const owned = state.character.ownedItems.includes(item.id);
              const equipped =
                state.character.equipped[item.category] === item.id;
              return (
                <Card key={item.id} tone="plain" className="">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 42 }}>{item.emoji}</div>
                    <div style={{ fontWeight: 700, marginTop: 6 }}>{item.name}</div>
                    <div
                      style={{
                        fontSize: 12,
                        color: 'var(--color-ink-soft)',
                        marginTop: 4,
                        minHeight: 32,
                      }}
                    >
                      {item.description}
                    </div>
                    <div style={{ marginTop: 10 }}>
                      {owned ? (
                        equipped ? (
                          <Button variant="ghost" size="sm" disabled>
                            <Check size={14} /> Equipped
                          </Button>
                        ) : (
                          <Button variant="secondary" size="sm" onClick={() => equipItem(item.id)}>
                            Equip
                          </Button>
                        )
                      ) : (
                        <Button size="sm" onClick={() => handleBuy(item.id)}>
                          <Coins size={14} /> {item.price}
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
