import { useState } from 'react';
import { Plus } from 'lucide-react';
import Button from '@/components/ui/Button';
import type { Task } from '@/types';
import { addDays, formatPretty } from '@/lib/dates';
import styles from './AddTaskForm.module.css';

type AddTaskFormProps = {
  onAdd: (input: Omit<Task, 'id' | 'completed' | 'createdAt' | 'completedAt'>) => void;
};

export default function AddTaskForm({ onAdd }: AddTaskFormProps) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [deadline, setDeadline] = useState('');
  const [extensionDays, setExtensionDays] = useState(2);
  const [difficulty, setDifficulty] = useState<'small' | 'medium' | 'big'>('small');
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({
      title: title.trim(),
      notes: notes.trim() || undefined,
      deadline: deadline || undefined,
      extensionDays,
      difficulty,
    });
    setTitle('');
    setNotes('');
    setDeadline('');
    setExtensionDays(2);
    setDifficulty('small');
    setExpanded(false);
  };

  const finalDate = deadline ? addDays(deadline, extensionDays) : null;

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.topRow}>
        <input
          type="text"
          placeholder="What's your next little quest? ✨"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          onFocus={() => setExpanded(true)}
          className={styles.titleInput}
        />
        <Button type="submit" disabled={!title.trim()}>
          <Plus size={18} /> Add
        </Button>
      </div>

      {expanded && (
        <div className={styles.expanded}>
          <textarea
            placeholder="Notes (optional) — break it down, add encouragement, anything 💛"
            value={notes}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
            className={styles.notes}
            rows={2}
          />

          <div className={styles.grid}>
            <label className={styles.field}>
              <span className={styles.label}>Official deadline</span>
              <input
                type="date"
                value={deadline}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDeadline(e.target.value)}
                className={styles.input}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>
                Grace period: <strong>{extensionDays} day{extensionDays === 1 ? '' : 's'}</strong>
              </span>
              <input
                type="range"
                min={0}
                max={14}
                value={extensionDays}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setExtensionDays(Number(e.target.value))}
                className={styles.range}
              />
            </label>

            <div className={styles.field}>
              <span className={styles.label}>Effort level</span>
              <div className={styles.diffRow}>
                <DiffButton current={difficulty} value="small" emoji="🌱" label="Small" onSelect={setDifficulty} />
                <DiffButton current={difficulty} value="medium" emoji="🌿" label="Medium" onSelect={setDifficulty} />
                <DiffButton current={difficulty} value="big" emoji="🌳" label="Big" onSelect={setDifficulty} />
              </div>
            </div>
          </div>

          {finalDate && (
            <div className={styles.hint}>
              🌼 Your true final deadline is <strong>{formatPretty(finalDate)}</strong>. No pressure — you've got this.
            </div>
          )}
        </div>
      )}
    </form>
  );
}

function DiffButton({
  current,
  value,
  emoji,
  label,
  onSelect,
}: {
  current: 'small' | 'medium' | 'big';
  value: 'small' | 'medium' | 'big';
  emoji: string;
  label: string;
  onSelect: (v: 'small' | 'medium' | 'big') => void;
}) {
  const active = current === value;
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={active ? `${styles.diffBtn} ${styles.diffBtnActive}` : styles.diffBtn}
    >
      <span>{emoji}</span>
      <span>{label}</span>
    </button>
  );
}
