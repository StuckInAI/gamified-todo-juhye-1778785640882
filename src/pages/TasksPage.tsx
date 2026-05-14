import { useMemo } from 'react';
import AddTaskForm from '@/components/tasks/AddTaskForm';
import TaskItem from '@/components/tasks/TaskItem';
import { useGame } from '@/hooks/useGame';
import { useToast } from '@/hooks/useToast';

export default function TasksPage() {
  const { state, addTask, toggleTask, deleteTask } = useGame();
  const { showToast } = useToast();

  const { open, done } = useMemo(() => {
    const open = state.tasks.filter((t) => !t.completed);
    const done = state.tasks.filter((t) => t.completed);
    return { open, done };
  }, [state.tasks]);

  const handleToggle = (id: string) => {
    const res = toggleTask(id);
    if (res) {
      showToast({
        emoji: res.leveledUp ? '🎉' : '✨',
        title: res.leveledUp ? 'Level up!' : 'Quest complete!',
        message: `+${res.xp} XP · +${res.coins} coins`,
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <header>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 28 }}>
          Your Quests 🌿
        </h1>
        <p style={{ marginTop: 6, color: 'var(--color-ink-soft)' }}>
          Small steps, big growth. Add a quest below to get started.
        </p>
      </header>

      <AddTaskForm onAdd={addTask} />

      <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <h2 style={{ margin: 0, fontSize: 16, color: 'var(--color-ink-soft)' }}>
          In progress ({open.length})
        </h2>
        {open.length === 0 ? (
          <div style={{ padding: 20, textAlign: 'center', color: 'var(--color-ink-faint)' }}>
            All caught up! 🌼
          </div>
        ) : (
          open.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={handleToggle} onDelete={deleteTask} />
          ))
        )}
      </section>

      {done.length > 0 && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <h2 style={{ margin: 0, fontSize: 16, color: 'var(--color-ink-soft)' }}>
            Completed ({done.length})
          </h2>
          {done.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={handleToggle} onDelete={deleteTask} />
          ))}
        </section>
      )}
    </div>
  );
}
