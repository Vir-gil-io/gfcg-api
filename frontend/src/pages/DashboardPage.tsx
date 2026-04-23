import { useState, useEffect, type FormEvent } from 'react';
import { tasksService, type CreateTaskDto } from '../services/tasks.service';
import type { Task } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [tasks,     setTasks]     = useState<Task[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [showForm,  setShowForm]  = useState(false);
  const [editTask,  setEditTask]  = useState<Task | null>(null);
  const [form, setForm] = useState<CreateTaskDto>({
    name: '', description: '', priority: false,
  });

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await tasksService.getAll();
      setTasks(data);
    } catch {
      setError('No se pudieron cargar las tareas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTasks(); }, []);

  const resetForm = () => {
    setForm({ name: '', description: '', priority: false });
    setEditTask(null);
    setShowForm(false);
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (editTask) {
        await tasksService.update(editTask.id, form);
      } else {
        await tasksService.create(form);
      }
      resetForm();
      loadTasks();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al guardar la tarea.');
    }
  };

  const handleEdit = (task: Task) => {
    setForm({ name: task.name, description: task.description, priority: task.priority });
    setEditTask(task);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta tarea?')) return;
    try {
      await tasksService.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch {
      setError('Error al eliminar la tarea.');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Mis Tareas</h1>
          <p>Bienvenido, {user?.name}. Aquí están tus tareas personales.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancelar' : '+ Nueva Tarea'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <div className="card form-card">
          <h3>{editTask ? 'Editar Tarea' : 'Nueva Tarea'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre de la tarea *</label>
              <input
                type="text" value={form.name} required
                minLength={3} maxLength={100}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nombre descriptivo de la tarea"
              />
            </div>
            <div className="form-group">
              <label>Descripción *</label>
              <textarea
                value={form.description} required
                minLength={3} maxLength={250}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe la tarea en detalle"
                rows={3}
              />
            </div>
            <div className="form-group form-check">
              <label>
                <input
                  type="checkbox" checked={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.checked })}
                />
                <span>Alta prioridad</span>
              </label>
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn-outline" onClick={resetForm}>Cancelar</button>
              <button type="submit" className="btn btn-primary">
                {editTask ? 'Actualizar' : 'Crear Tarea'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Cargando tareas...</div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <p>📋 No tienes tareas aún. ¡Crea tu primera tarea!</p>
        </div>
      ) : (
        <div className="tasks-grid">
          {tasks.map((task) => (
            <div key={task.id} className={`task-card ${task.priority ? 'task-priority' : ''}`}>
              <div className="task-card-header">
                <h3>{task.name}</h3>
                {task.priority && <span className="badge badge-priority">🔥 Prioritaria</span>}
              </div>
              <p className="task-description">{task.description}</p>
              <div className="task-card-footer">
                <span className="task-date">
                  {new Date(task.created_at).toLocaleDateString('es-MX')}
                </span>
                <div className="task-actions">
                  <button className="btn btn-sm btn-outline" onClick={() => handleEdit(task)}>
                    Editar
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(task.id)}>
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};