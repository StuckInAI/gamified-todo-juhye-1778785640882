import type { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import styles from './Card.module.css';

export type CardVariant = 'plain' | 'pink' | 'mint' | 'sky' | 'lavender' | 'yellow';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant;
  tone?: CardVariant;
  children: ReactNode;
};

export default function Card({
  variant,
  tone,
  className,
  children,
  ...rest
}: CardProps) {
  const resolved = variant ?? tone ?? 'plain';
  return (
    <div className={clsx(styles.card, styles[resolved], className)} {...rest}>
      {children}
    </div>
  );
}
