const STORAGE_KEY = 'parastrom_tasks';

function formatTimestamp(date) {
  const pad = n => n.toString().padStart(2, '0');
  return (
    date.getFullYear().toString() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  );
}

function parseTimestamp(value) {
  if (typeof value === 'number') return value;
  const str = String(value);
  if (str.length !== 14) return Date.parse(str);
  const year = parseInt(str.slice(0, 4), 10);
  const month = parseInt(str.slice(4, 6), 10) - 1;
  const day = parseInt(str.slice(6, 8), 10);
  const hour = parseInt(str.slice(8, 10), 10);
  const min = parseInt(str.slice(10, 12), 10);
  const sec = parseInt(str.slice(12, 14), 10);
  return new Date(year, month, day, hour, min, sec).getTime();
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function showNotification(title) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Task fertig', { body: title });
  }
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

function FlowProgress({ progress, id }) {
  const pathRef = React.useRef(null);
  const [length, setLength] = React.useState(0);
  const [pos, setPos] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    if (pathRef.current) {
      const l = pathRef.current.getTotalLength();
      setLength(l);
    }
  }, []);

  React.useEffect(() => {
    if (pathRef.current && length) {
      const point = pathRef.current.getPointAtLength(length * progress);
      setPos({ x: point.x, y: point.y });
    }
  }, [progress, length]);

  const offset = length - length * progress;
  const gradOffset = progress * 100;

  return (
    <div className="w-full h-6 bg-gray-200 rounded overflow-hidden">
      <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full">
        <defs>
          <linearGradient id={`flow-gradient-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset={`${gradOffset}%`} stopColor="#3b82f6" />
            <stop offset={`${gradOffset}%`} stopColor="#10b981" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <filter id={`glow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          ref={pathRef}
          d="M0 10 C 20 0 40 0 50 10 C 60 20 80 20 100 10"
          fill="none"
          stroke={`url(#flow-gradient-${id})`}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={length}
          strokeDashoffset={offset}
          className="animate-flow"
          style={{ transition: 'stroke-dashoffset 1s linear' }}
        />
        <circle cx={pos.x} cy={pos.y} r="2" fill={`url(#flow-gradient-${id})`} filter={`url(#glow-${id})`} />
      </svg>
    </div>
  );
}

function ParticleProgress({ progress }) {
  const canvasRef = React.useRef(null);
  const particlesRef = React.useRef([]);
  const progressRef = React.useRef(progress);
  const animationRef = React.useRef();

  React.useEffect(() => {
    progressRef.current = progress;
  }, [progress]);


  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const colors = ["#93c5fd", "#6ee7b7"];
    const baseSpeed = 0.25;
    let speed = baseSpeed;

    const resize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const spawnParticle = () => {
      const width = canvas.width * progressRef.current;
      if (width <= 0) return;
      const r = 1 + Math.random() * 2;
      const x = Math.random() * width;
      const y = canvas.height + r;
      const vy = (-0.5 - Math.random() * 0.5) * speed;
      const color = colors[Math.floor(Math.random() * colors.length)];
      particlesRef.current.push({ x, y, r, vy, color, alpha: 1 });
    };

    const draw = () => {

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width * progressRef.current;
      if (width > 0) {
        const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
        grad.addColorStop(0, colors[0]);
        grad.addColorStop(1, colors[1]);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, canvas.height);
      }

      if (progressRef.current < 1) {
        for (let i = 0; i < 3; i++) spawnParticle();
        const next = [];
        particlesRef.current.forEach(p => {
          p.y += p.vy;
          p.alpha -= 0.01 * speed;
          if (p.alpha > 0 && p.y > -p.r) next.push(p);
          ctx.globalAlpha = Math.max(p.alpha, 0);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;
        particlesRef.current = next;
        animationRef.current = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className="w-full h-6 bg-gray-200 rounded overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full"></canvas>
    </div>
  );
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
    const timestamp = formatTimestamp(new Date());
    const task = {
      id: timestamp,
      title,
      category,
      priority,
      startTime: timestamp,
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
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-3 w-full max-w-md">
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Titel" className="border border-gray-300 rounded p-2 w-full" required />
      <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Kategorie" className="border border-gray-300 rounded p-2 w-full" />
      <div className="flex space-x-2">
        {['low', 'medium', 'high'].map(p => (
          <button
            key={p}
            type="button"
            onClick={() => setPriority(p)}
            className={`px-3 py-1 rounded-full border text-sm flex-1 ${priority === p ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>
      <div className="flex space-x-2">
        <input type="number" min="1" value={duration} onChange={e => setDuration(Number(e.target.value))} className="border border-gray-300 rounded p-2 flex-1" />
        <select value={unit} onChange={e => setUnit(e.target.value)} className="border border-gray-300 rounded p-2 w-1/2">
          <option value="minutes">Minuten</option>
          <option value="hours">Stunden</option>
          <option value="days">Tage</option>
        </select>
      </div>
      <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notizen" className="border border-gray-300 rounded p-2 w-full"></textarea>
      <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-4 py-2">Speichern</button>
    </form>
  );
}

function TaskItem({ task, onToggle, onDelete }) {
  const [progress, setProgress] = React.useState(0);
  const notificationShown = React.useRef(false);

  // Mapping der Priorität auf Tailwind-Farben für den Punkt oben links
  const priorityColors = {
    low: "bg-green-500",
    medium: "bg-yellow-500",
    high: "bg-red-500",
  };
  React.useEffect(() => {
    const update = () => {
      if (task.done) {
        setProgress(1);
        return;
      }
      const now = Date.now();
      const start = parseTimestamp(task.startTime);
      const p = Math.min((now - start) / task.durationMs, 1);
      setProgress(p);
      if (p >= 1 && !notificationShown.current) {
        showNotification(task.title);
        notificationShown.current = true;
      }
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [task]);


  return (
    <div
      className={`relative border p-4 bg-white rounded shadow transition-opacity duration-300 flex flex-col h-52 ${task.done ? 'opacity-60' : ''}`}
    >
      {/* Prioritätspunkt und Kategorie links oben */}
      <div className="flex items-center space-x-2">
        <span className={`w-3 h-3 rounded-full ${priorityColors[task.priority]}`}></span>
        {task.category && (
          <span className="px-2 py-0.5 text-xs rounded-full bg-gray-200">
            {task.category}
          </span>
        )}
      </div>

      {/* Action-Buttons fest oben rechts positioniert */}
      <div className="absolute top-2 right-2 space-x-2">
        <button
          onClick={() => onToggle(task.id)}
          className="text-sm text-teal-600 hover:underline"
        >
          {task.done ? 'Rückgängig' : 'Erledigt'}
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="text-sm text-red-600 hover:underline"
        >
          Löschen
        </button>
      </div>

      {/* Titel und optionale Notizen werden gekürzt */}
      <h3 className="font-bold mt-2 line-clamp-1">{task.title}</h3>
      {task.notes && (
        <p className="text-sm text-gray-700 mt-1 line-clamp-2">{task.notes}</p>
      )}

      {/* Fortschrittsbalken immer am unteren Rand */}
      <div className="mt-auto">
        <ParticleProgress progress={progress} />
      </div>
    </div>
  );
}

function App() {
  const [tasks, setTasks] = React.useState(loadTasks());
  const [showForm, setShowForm] = React.useState(false);

  React.useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  React.useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const addTask = task => {
    setTasks([...tasks, task]);
    setShowForm(false);
  };
  const toggleTask = id => {
    setTasks(tasks.map(t => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const deleteTask = id => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const activeCount = tasks.filter(t => !t.done).length;
  const doneCount = tasks.filter(t => t.done).length;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <header className="flex items-center mb-4">
        <div className="flex items-center">
          <img src="logo.png" alt="Paraström" className="w-10 mr-2" />
          <h1 className="text-xl font-bold">Paraström</h1>
        </div>
        <div className="ml-auto flex items-center space-x-2">
          <span className="text-sm text-gray-600">{activeCount} aktiv | {doneCount} erledigt</span>
          <button onClick={() => exportTasks(tasks)} className="p-2 bg-white rounded-full shadow text-teal-600 hover:bg-teal-50">⬇️</button>
          <button onClick={() => importTasks(setTasks)} className="p-2 bg-white rounded-full shadow text-teal-600 hover:bg-teal-50">⬆️</button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tasks.map(task => (
          <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <TaskForm onAdd={addTask} />
        </div>
      )}

      <button onClick={() => setShowForm(true)} className="fixed bottom-4 right-4 bg-teal-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg text-2xl">+</button>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
