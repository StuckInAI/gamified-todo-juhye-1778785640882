import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { CharacterState, GameState, Task, EquippedSlots, ItemCategory } from '@/types';
import { loadState, saveState } from '@/lib/storage';
import { applyXp, difficultyRewards } from '@/lib/leveling';
import { getItemById } from '@/lib/shopItems';

type PurchaseResult = { ok: true } | { ok: false; reason: string };

type GameContextValue = {
  state: GameState;
  addTask: (input: Omit<Task, 'id' | 'completed' | 'createdAt' | 'completedAt'>) => void;
  toggleTask: (id: string) => { leveledUp: boolean; xp: number; coins: number } | null;
  deleteTask: (id: string) => void;
  buyItem: (itemId: string) => PurchaseResult;
  equipItem: (itemId: string) => void;
  unequipSlot: (slot: keyof EquippedSlots) => void;
  renameCharacter: (name: string) => void;
  resetAll: () => void;
};

const INITIAL_CHARACTER: CharacterState = {
  name: 'Mochi',
  level: 1,
  xp: 0,
  coins: 50,
  ownedItems: [],
  equipped: {},
};

const INITIAL_STATE: GameState = {
  character: INITIAL_CHARACTER,
  tasks: [
    {
      id: 'seed-1',
      title: 'Welcome! Try checking off this task ✨',
      notes: 'Completing tasks earns XP and coins. Buy items in the Shop!',
      extensionDays: 2,
      difficulty: 'small',
      completed: false,
      createdAt: Date.now(),
    },
  ],
};

const GameContext = createContext<GameContextValue | null>(null);

function categoryToSlot(cat: ItemCategory): keyof EquippedSlots {
  return cat;
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(() => loadState<GameState>(INITIAL_STATE));

  useEffect(() => {
    saveState(state);
  }, [state]);

  const value = useMemo<GameContextValue>(() => {
    return {
      state,
      addTask: (input) => {
        setState((prev) => ({
          ...prev,
          tasks: [
            {
              id: crypto.randomUUID(),
              completed: false,
              createdAt: Date.now(),
              ...input,
            },
            ...prev.tasks,
          ],
        }));
      },
      toggleTask: (id) => {
        let result: { leveledUp: boolean; xp: number; coins: number } | null = null;
        setState((prev) => {
          const task = prev.tasks.find((t) => t.id === id);
          if (!task) return prev;
          const newCompleted = !task.completed;
          const tasks = prev.tasks.map((t) =>
            t.id === id
              ? { ...t, completed: newCompleted, completedAt: newCompleted ? Date.now() : undefined }
              : t
          );
          if (newCompleted) {
            const rewards = difficultyRewards(task.difficulty);
            const { level, xp, leveledUp } = applyXp(prev.character.level, prev.character.xp, rewards.xp);
            const bonus = leveledUp ? 25 : 0;
            result = { leveledUp, xp: rewards.xp, coins: rewards.coins + bonus };
            return {
              ...prev,
              tasks,
              character: {
                ...prev.character,
                level,
                xp,
                coins: prev.character.coins + rewards.coins + bonus,
              },
            };
          }
          return { ...prev, tasks };
        });
        return result;
      },
      deleteTask: (id) => {
        setState((prev) => ({ ...prev, tasks: prev.tasks.filter((t) => t.id !== id) }));
      },
      buyItem: (itemId) => {
        const item = getItemById(itemId);
        if (!item) return { ok: false, reason: 'Item not found' };
        if (state.character.ownedItems.includes(itemId)) {
          return { ok: false, reason: 'Already owned' };
        }
        if (state.character.coins < item.price) {
          return { ok: false, reason: 'Not enough coins' };
        }
        setState((prev) => ({
          ...prev,
          character: {
            ...prev.character,
            coins: prev.character.coins - item.price,
            ownedItems: [...prev.character.ownedItems, itemId],
            equipped: {
              ...prev.character.equipped,
              [categoryToSlot(item.category)]: itemId,
            },
          },
        }));
        return { ok: true };
      },
      equipItem: (itemId) => {
        const item = getItemById(itemId);
        if (!item) return;
        setState((prev) => ({
          ...prev,
          character: {
            ...prev.character,
            equipped: {
              ...prev.character.equipped,
              [categoryToSlot(item.category)]: itemId,
            },
          },
        }));
      },
      unequipSlot: (slot) => {
        setState((prev) => {
          const next = { ...prev.character.equipped };
          delete next[slot];
          return { ...prev, character: { ...prev.character, equipped: next } };
        });
      },
      renameCharacter: (name) => {
        setState((prev) => ({ ...prev, character: { ...prev.character, name } }));
      },
      resetAll: () => {
        setState(INITIAL_STATE);
      },
    };
  }, [state]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
