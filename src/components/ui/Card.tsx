import type { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import styles from './Card.module.css';

type CardVariant = 'default' | 'plain' | 'pink' | 'mint' | 'sky' | 'lavender' | 'yellow';

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant;
  children: ReactNode;
};

export default function Card({
  variant = 'default',
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={clsx(styles.card, variant !== 'default' && styles[variant], className)}
      {...rest}
    >
      {children}
    </div>
  );
}
