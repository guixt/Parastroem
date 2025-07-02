const STORAGE_KEY = 'parastrom_tasks';

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function exportTasks(tasks) {
  const dataStr = JSON.stringify(tasks, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'parastrom-tasks.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importTasks(setTasks) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';
  input.onchange = () => {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const tasks = JSON.parse(e.target.result);
        setTasks(tasks);
      } catch (err) {
        alert('Import fehlgeschlagen');
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

function TaskForm({ onAdd }) {
  const [title, setTitle] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [priority, setPriority] = React.useState('low');
  const [duration, setDuration] = React.useState(1);
  const [unit, setUnit] = React.useState('minutes');
  const [notes, setNotes] = React.useState('');

  const handleSubmit = e => {
    e.preventDefault();
    const multiplier = { minutes: 60000, hours: 3600000, days: 86400000 }[unit];
    const task = {
      id: Date.now(),
      title,
      category,
      priority,
      startTime: Date.now(),
      durationMs: duration * multiplier,
      notes,
      done: false,
    };
    onAdd(task);
    setTitle('');
    setCategory('');
    setPriority('low');
    setDuration(1);
    setUnit('minutes');
    setNotes('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 space-y-2">
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Titel" className="border p-1 w-full" required />
      <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Kategorie" className="border p-1 w-full" />
      <select value={priority} onChange={e => setPriority(e.target.value)} className="border p-1 w-full">
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <div className="flex space-x-2">
        <input type="number" min="1" value={duration} onChange={e => setDuration(Number(e.target.value))} className="border p-1 w-1/2" />
        <select value={unit} onChange={e => setUnit(e.target.value)} className="border p-1 w-1/2">
          <option value="minutes">Minuten</option>
          <option value="hours">Stunden</option>
          <option value="days">Tage</option>
        </select>
      </div>
      <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notizen" className="border p-1 w-full"></textarea>
      <button type="submit" className="bg-blue-500 text-white px-2 py-1">Task anlegen</button>
    </form>
  );
}

function TaskItem({ task, onToggle, onDelete }) {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const update = () => {
      if (task.done) {
        setProgress(1);
        return;
      }
      const now = Date.now();
      const p = Math.min((now - task.startTime) / task.durationMs, 1);
      setProgress(p);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [task]);

  const barColor = task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <div className="border p-2 bg-white rounded shadow">
      <div className="flex justify-between items-start mb-1">
        <div>
          <h3 className="font-bold">{task.title}</h3>
          <p className="text-sm text-gray-600">{task.category}</p>
        </div>
        <div className="space-x-2">
          <button onClick={() => onToggle(task.id)} className="text-sm text-blue-600">
            {task.done ? 'Rückgängig' : 'Erledigt'}
          </button>
          <button onClick={() => onDelete(task.id)} className="text-sm text-red-600">Löschen</button>
        </div>
      </div>
      <div className="h-2 bg-gray-200">
        <div className={`${barColor} h-full`} style={{ width: `${progress * 100}%`, transition: 'width 1s linear' }}></div>
      </div>
    </div>
  );
}

function App() {
  const [tasks, setTasks] = React.useState(loadTasks());

  React.useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const addTask = task => setTasks([...tasks, task]);

  const toggleTask = id => {
    setTasks(tasks.map(t => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const deleteTask = id => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="max-w-xl mx-auto">
      <img src="logo.png" alt="Paraström" className="w-24 mx-auto mb-2" />
      <h1 className="text-2xl font-bold mb-4 text-center">Paraström</h1>
      <TaskForm onAdd={addTask} />
      <div className="flex space-x-2 mb-4">
        <button onClick={() => exportTasks(tasks)} className="bg-gray-500 text-white px-2 py-1">Export</button>
        <button onClick={() => importTasks(setTasks)} className="bg-gray-500 text-white px-2 py-1">Import</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tasks.map(task => (
          <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
        ))}
      </div>
      {/* Roadmap:
        - Screenshots/Dokumente anhängen
        - Web Notifications
        - Filter/Sortierung
        - Cloud-Sync (z.B. Firebase)
        - Dark Mode / Themes
        - Mehrsprachigkeit
        - Export als PDF/CSV
      */}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
