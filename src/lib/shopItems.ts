import type { ShopItem } from '@/types';

export const SHOP_ITEMS: ShopItem[] = [
  // Hats
  { id: 'hat_flower_crown', name: 'Flower Crown', category: 'hat', price: 40, rarity: 'common', emoji: '🌸', description: 'A wreath of soft spring blossoms.' },
  { id: 'hat_strawberry', name: 'Strawberry Beret', category: 'hat', price: 70, rarity: 'rare', emoji: '🍓', description: 'Sweet, juicy, and a little bit silly.' },
  { id: 'hat_star', name: 'Stargazer Cap', category: 'hat', price: 120, rarity: 'epic', emoji: '⭐', description: 'For dreamers who reach for the stars.' },
  { id: 'hat_mushroom', name: 'Mushroom Hood', category: 'hat', price: 90, rarity: 'rare', emoji: '🍄', description: 'Forest-fresh and ever so cozy.' },

  // Outfits
  { id: 'out_cozy_sweater', name: 'Cozy Sweater', category: 'outfit', price: 60, rarity: 'common', emoji: '🧶', description: 'Hand-knit with love and chamomile tea.' },
  { id: 'out_overalls', name: 'Garden Overalls', category: 'outfit', price: 85, rarity: 'common', emoji: '👖', description: 'Perfect for tending to your to-do garden.' },
  { id: 'out_starcloak', name: 'Starlight Cloak', category: 'outfit', price: 160, rarity: 'epic', emoji: '✨', description: 'Twinkles softly when you complete a task.' },
  { id: 'out_raincoat', name: 'Honey Raincoat', category: 'outfit', price: 95, rarity: 'rare', emoji: '🧥', description: 'Warm yellow, like sunlight after rain.' },

  // Accessories
  { id: 'acc_scarf', name: 'Fluffy Scarf', category: 'accessory', price: 30, rarity: 'common', emoji: '🧣', description: 'A hug that goes around your neck.' },
  { id: 'acc_glasses', name: 'Bookworm Specs', category: 'accessory', price: 50, rarity: 'common', emoji: '👓', description: 'Makes everything feel more focused.' },
  { id: 'acc_butterfly', name: 'Butterfly Friend', category: 'accessory', price: 110, rarity: 'epic', emoji: '🦋', description: 'A tiny companion who believes in you.' },
  { id: 'acc_headphones', name: 'Lo-fi Headphones', category: 'accessory', price: 80, rarity: 'rare', emoji: '🎧', description: 'Cozy beats for cozy quests.' },

  // Decorations (for the room background)
  { id: 'dec_plant', name: 'Little Plant', category: 'decoration', price: 35, rarity: 'common', emoji: '🪴', description: 'A green friend who waves quietly.' },
  { id: 'dec_lantern', name: 'Paper Lantern', category: 'decoration', price: 65, rarity: 'rare', emoji: '🏮', description: 'Casts a warm, gentle glow.' },
  { id: 'dec_rainbow', name: 'Tiny Rainbow', category: 'decoration', price: 140, rarity: 'epic', emoji: '🌈', description: 'A reminder that storms always pass.' },
  { id: 'dec_cake', name: 'Celebration Cake', category: 'decoration', price: 75, rarity: 'rare', emoji: '🎂', description: 'Every finished task deserves cake.' },
];

export function getItemById(id: string): ShopItem | undefined {
  return SHOP_ITEMS.find((i) => i.id === id);
}
