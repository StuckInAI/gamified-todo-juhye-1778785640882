import Card from '@/components/ui/Card';
import AddTaskForm from '@/components/tasks/AddTaskForm';
import TaskItem from '@/components/tasks/TaskItem';
import { useGame } from '@/hooks/useGame';
import { useToast } from '@/hooks/useToast';
import styles from './TasksPage.module.css';

export default function TasksPage() {
  const { state, addTask, toggleTask, deleteTask } = useGame();
  const { showToast } = useToast();

  const open = state.tasks.filter((t) => !t.completed);
  const done = state.tasks.filter((t) => t.completed);

  const handleToggle = (id: string) => {
    const result = toggleTask(id);
    if (result) {
      showToast({
        emoji: result.leveledUp ? '🎊' : '✨',
        title: result.leveledUp ? 'Level up!' : 'Nice work!',
        message: `+${result.xp} XP, +${result.coins} coins`,
      });
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>📋 Your Quests</h1>
        <p className={styles.subtitle}>
          Add tasks with gentle deadlines and a little grace period. You're doing great.
        </p>
      </header>

      <AddTaskForm onAdd={addTask} />

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          🌱 To do <span className={styles.count}>{open.length}</span>
        </h2>
        {open.length === 0 ? (
          <Card tone="mint" className={styles.empty}>
            🌷 No open quests. Take a breath, sip something warm, and add one when you're ready.
          </Card>
        ) : (
          <ul className={styles.list}>
            {open.map((t) => (
              <li key={t.id}>
                <TaskItem task={t} onToggle={handleToggle} onDelete={deleteTask} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {done.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            ✅ Completed <span className={styles.count}>{done.length}</span>
          </h2>
          <ul className={styles.list}>
            {done.map((t) => (
              <li key={t.id}>
                <TaskItem task={t} onToggle={handleToggle} onDelete={deleteTask} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
