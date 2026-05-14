// XP needed to reach the NEXT level from the start of the current level.
export function xpForNextLevel(level: number): number {
  return 50 + level * 30;
}

export function difficultyRewards(difficulty: 'small' | 'medium' | 'big'): { xp: number; coins: number } {
  switch (difficulty) {
    case 'small':
      return { xp: 15, coins: 8 };
    case 'medium':
      return { xp: 35, coins: 18 };
    case 'big':
      return { xp: 70, coins: 40 };
  }
}

export function applyXp(level: number, xp: number, gainedXp: number): { level: number; xp: number; leveledUp: boolean } {
  let newLevel = level;
  let newXp = xp + gainedXp;
  let leveledUp = false;
  while (newXp >= xpForNextLevel(newLevel)) {
    newXp -= xpForNextLevel(newLevel);
    newLevel += 1;
    leveledUp = true;
  }
  return { level: newLevel, xp: newXp, leveledUp };
}
