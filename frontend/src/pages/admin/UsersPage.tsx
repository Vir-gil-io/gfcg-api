import { useState, useEffect } from 'react';
import { usersService } from '../../services/users.service';
import type { User } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

export const UsersPage = () => {
  const { user: currentUser } = useAuth();
  const [users,   setUsers]   = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await usersService.getAll();
      setUsers(data);
    } catch {
      setError('Error al cargar usuarios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const handleDelete = async (u: User) => {
    if (u.id === currentUser?.id) {
      alert('No puedes eliminar tu propia cuenta desde aquí. Ve a Mi Perfil.');
      return;
    }
    if (!confirm(`¿Eliminar al usuario "${u.username}"? Esta acción es irreversible.`)) return;

    try {
      await usersService.delete(u.id);
      setSuccess(`Usuario "${u.username}" eliminado.`);
      setUsers((prev) => prev.filter((x) => x.id !== u.id));
    } catch (err: any) {
      setError(err.response?.data?.error || 'No se puede eliminar (puede tener tareas asignadas).');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Gestión de Usuarios</h1>
          <p>Panel de administración — todos los usuarios del sistema</p>
        </div>
        <span className="badge badge-admin">Solo ADMIN</span>
      </div>

      {error   && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {loading ? (
        <div className="loading">Cargando usuarios...</div>
      ) : (
        <div className="card">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Usuario</th>
                  <th>Rol</th>
                  <th>Registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className={u.id === currentUser?.id ? 'row-highlight' : ''}>
                    <td>{u.id}</td>
                    <td>{u.name} {u.lastname}</td>
                    <td><code>{u.username}</code></td>
                    <td>
                      <span className={`badge badge-${u.role.toLowerCase()}`}>{u.role}</span>
                    </td>
                    <td>{new Date(u.created_at).toLocaleDateString('es-MX')}</td>
                    <td>
                      {u.id !== currentUser?.id ? (
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(u)}
                        >
                          Eliminar
                        </button>
                      ) : (
                        <span className="text-muted">Tú mismo</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};