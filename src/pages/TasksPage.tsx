import { useMemo, useState } from 'react';
import AddTaskForm from '@/components/tasks/AddTaskForm';
import TaskItem from '@/components/tasks/TaskItem';
import { useGame } from '@/hooks/useGame';
import { useToast } from '@/hooks/useToast';
import styles from './TasksPage.module.css';
import clsx from 'clsx';

type Filter = 'all' | 'open' | 'done';

export default function TasksPage() {
  const { state, addTask, toggleTask, deleteTask } = useGame();
  const { showToast } = useToast();
  const [filter, setFilter] = useState<Filter>('open');

  const visible = useMemo(() => {
    return state.tasks.filter((t) => {
      if (filter === 'open') return !t.completed;
      if (filter === 'done') return t.completed;
      return true;
    });
  }, [state.tasks, filter]);

  const handleToggle = (id: string) => {
    const result = toggleTask(id);
    if (result) {
      if (result.leveledUp) {
        showToast({
          emoji: '🎉',
          title: 'Level up!',
          message: `+${result.xp} XP · +${result.coins} coins (level-up bonus!)`,
        });
      } else {
        showToast({
          emoji: '🌟',
          title: 'Quest complete!',
          message: `+${result.xp} XP · +${result.coins} coins`,
        });
      }
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Your Quests 🌷</h1>
          <p className={styles.sub}>Add tasks at your own pace. No pressure, only progress.</p>
        </div>

        <div className={styles.filters}>
          <FilterPill current={filter} value="open" label="To do" onSelect={setFilter} />
          <FilterPill current={filter} value="done" label="Done" onSelect={setFilter} />
          <FilterPill current={filter} value="all" label="All" onSelect={setFilter} />
        </div>
      </div>

      <AddTaskForm onAdd={addTask} />

      <div className={styles.list}>
        {visible.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyEmoji}>🌱</div>
            <h3>{filter === 'done' ? 'No completed quests yet' : 'All quiet here'}</h3>
            <p>
              {filter === 'done'
                ? 'Finish a task and watch your character celebrate!'
                : 'Plant your first tiny quest above. It can be as small as a single deep breath.'}
            </p>
          </div>
        ) : (
          visible.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={handleToggle} onDelete={deleteTask} />
          ))
        )}
      </div>
    </div>
  );
}

function FilterPill({
  current,
  value,
  label,
  onSelect,
}: {
  current: Filter;
  value: Filter;
  label: string;
  onSelect: (v: Filter) => void;
}) {
  return (
    <button
      onClick={() => onSelect(value)}
      className={clsx(styles.pill, current === value && styles.pillActive)}
    >
      {label}
    </button>
  );
}
