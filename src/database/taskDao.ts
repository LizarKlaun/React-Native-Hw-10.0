import { getDatabase } from './db';

export interface TaskRecord {
  id: string;
  title: string;
  description: string;
  is_completed: number;
  created_at: number;
}

export const initTaskTable = (): void => {
  const db = getDatabase();
  db.execSync(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      is_completed INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL
    );
  `);
};

export const fetchAllTasks = (): TaskRecord[] => {
  const db = getDatabase();
  return db.getAllSync<TaskRecord>('SELECT * FROM tasks ORDER BY created_at DESC');
};

export const insertTaskRecord = (
  id: string,
  title: string,
  description: string
): void => {
  const db = getDatabase();
  db.runSync(
    'INSERT INTO tasks (id, title, description, is_completed, created_at) VALUES (?, ?, ?, 0, ?)',
    [id, title, description, Date.now()]
  );
};

export const toggleTaskCompletion = (id: string, currentStatus: number): void => {
  const db = getDatabase();
  const newStatus = currentStatus === 1 ? 0 : 1;
  db.runSync('UPDATE tasks SET is_completed = ? WHERE id = ?', [newStatus, id]);
};

// Функція видалення задачі з локальної БД SQLite
export const deleteTaskRecord = (id: string): void => {
  const db = getDatabase();
  db.runSync('DELETE FROM tasks WHERE id = ?', [id]);
};