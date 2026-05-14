export type Rarity = 'common' | 'rare' | 'epic';

export type ItemCategory = 'hat' | 'outfit' | 'accessory' | 'decoration';

export type ShopItem = {
  id: string;
  name: string;
  category: ItemCategory;
  price: number;
  rarity: Rarity;
  emoji: string;
  description: string;
};

export type Task = {
  id: string;
  title: string;
  notes?: string;
  deadline?: string; // ISO date (yyyy-mm-dd)
  extensionDays: number;
  difficulty: 'small' | 'medium' | 'big';
  completed: boolean;
  createdAt: number;
  completedAt?: number;
};

export type EquippedSlots = {
  hat?: string;
  outfit?: string;
  accessory?: string;
  decoration?: string;
};

export type CharacterState = {
  name: string;
  level: number;
  xp: number;
  coins: number;
  ownedItems: string[];
  equipped: EquippedSlots;
};

export type GameState = {
  character: CharacterState;
  tasks: Task[];
};
