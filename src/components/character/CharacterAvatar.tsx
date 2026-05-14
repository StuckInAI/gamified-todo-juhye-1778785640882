import { useGame } from '@/hooks/useGame';
import { getItemById } from '@/lib/shopItems';
import styles from './Character.module.css';
import clsx from 'clsx';

type CharacterAvatarProps = {
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
};

export default function CharacterAvatar({ size = 'md', showName = false }: CharacterAvatarProps) {
  const { state } = useGame();
  const { character } = state;

  const hat = character.equipped.hat ? getItemById(character.equipped.hat) : undefined;
  const outfit = character.equipped.outfit ? getItemById(character.equipped.outfit) : undefined;
  const accessory = character.equipped.accessory ? getItemById(character.equipped.accessory) : undefined;
  const decoration = character.equipped.decoration ? getItemById(character.equipped.decoration) : undefined;

  return (
    <div className={clsx(styles.scene, styles[size])}>
      <div className={styles.sky}>
        <span className={styles.cloud} style={{ left: '12%', top: '15%' }}>☁️</span>
        <span className={styles.cloud} style={{ left: '70%', top: '8%' }}>☁️</span>
        {decoration && <span className={styles.decoration}>{decoration.emoji}</span>}
      </div>

      <div className={styles.ground}>
        <div className={styles.character}>
          {hat && <div className={styles.hat}>{hat.emoji}</div>}
          <div className={styles.head}>
            <div className={styles.eyes}>
              <span className={styles.eye} />
              <span className={styles.eye} />
            </div>
            <div className={styles.cheek} style={{ left: '14%' }} />
            <div className={styles.cheek} style={{ right: '14%' }} />
            <div className={styles.mouth} />
          </div>
          <div className={styles.body}>
            <div className={clsx(styles.arm, styles.armLeft)}>
              <div className={styles.hand} />
            </div>
            <div className={clsx(styles.arm, styles.armRight)}>
              <div className={styles.hand} />
            </div>
            {outfit ? <span className={styles.outfit}>{outfit.emoji}</span> : <span className={styles.outfit}>👕</span>}
          </div>
          <div className={clsx(styles.leg, styles.legLeft)}>
            <div className={styles.foot} />
          </div>
          <div className={clsx(styles.leg, styles.legRight)}>
            <div className={styles.foot} />
          </div>
          {accessory && <div className={styles.accessory}>{accessory.emoji}</div>}
        </div>
        <div className={styles.shadow} />
      </div>

      {showName && <div className={styles.nameTag}>{character.name}</div>}
    </div>
  );
}
