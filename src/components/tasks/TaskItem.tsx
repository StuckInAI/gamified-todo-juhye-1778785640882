import { Trash2, Calendar, Clock, Sparkles } from 'lucide-react';
import type { Task } from '@/types';
import { addDays, daysUntil, formatPretty, todayIso } from '@/lib/dates';
import clsx from 'clsx';
import styles from './TaskItem.module.css';

type TaskItemProps = {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const finalDeadline = task.deadline ? addDays(task.deadline, task.extensionDays) : undefined;
  const officialLeft = task.deadline ? daysUntil(task.deadline) : null;
  const finalLeft = finalDeadline ? daysUntil(finalDeadline) : null;

  let status: 'safe' | 'grace' | 'overdue' | 'none' = 'none';
  if (task.deadline && !task.completed) {
    const today = todayIso();
    if (today <= task.deadline) status = 'safe';
    else if (finalDeadline && today <= finalDeadline) status = 'grace';
    else status = 'overdue';
  }

  const difficultyEmoji = task.difficulty === 'small' ? '🌱' : task.difficulty === 'medium' ? '🌿' : '🌳';

  return (
    <div className={clsx(styles.item, task.completed && styles.completed)}>
      <button
        className={clsx(styles.check, task.completed && styles.checked)}
        onClick={() => onToggle(task.id)}
        aria-label={task.completed ? 'Mark as not done' : 'Mark as done'}
      >
        {task.completed && '✓'}
      </button>

      <div className={styles.body}>
        <div className={styles.titleRow}>
          <span className={styles.title}>{task.title}</span>
          <span className={styles.difficulty} title={`${task.difficulty} task`}>
            {difficultyEmoji}
          </span>
        </div>
        {task.notes && <p className={styles.notes}>{task.notes}</p>}

        {task.deadline && (
          <div className={styles.meta}>
            <span className={clsx(styles.chip, styles[`status_${status}`])}>
              <Calendar size={12} />
              Due {formatPretty(task.deadline)}
              {officialLeft !== null && !task.completed && (
                <em>
                  {officialLeft >= 0 ? `(in ${officialLeft}d)` : `(${Math.abs(officialLeft)}d past)`}
                </em>
              )}
            </span>
            {task.extensionDays > 0 && finalDeadline && (
              <span className={styles.chip} title="Grace period">
                <Clock size={12} />
                +{task.extensionDays}d grace → {formatPretty(finalDeadline)}
                {finalLeft !== null && !task.completed && finalLeft < 0 && <em> (over)</em>}
              </span>
            )}
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <span className={styles.reward}>
          <Sparkles size={12} />
          {task.difficulty === 'small' ? '+8' : task.difficulty === 'medium' ? '+18' : '+40'}
        </span>
        <button className={styles.deleteBtn} onClick={() => onDelete(task.id)} aria-label="Delete task">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
