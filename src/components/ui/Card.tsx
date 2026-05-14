import type { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './Card.module.css';

type CardProps = {
  children: ReactNode;
  className?: string;
  tone?: 'plain' | 'pink' | 'mint' | 'sky' | 'lavender' | 'yellow';
};

export default function Card({ children, className, tone = 'plain' }: CardProps) {
  return <div className={clsx(styles.card, styles[tone], className)}>{children}</div>;
}
