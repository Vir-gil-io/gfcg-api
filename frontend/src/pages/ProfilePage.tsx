import { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usersService } from '../services/users.service';
import { authService } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

export const ProfilePage = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const [form,    setForm]    = useState({ name: user?.name ?? '', lastname: user?.lastname ?? '' });
  const [success, setSuccess] = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) setForm({ name: user.name, lastname: user.lastname });
  }, [user]);

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await usersService.update(user!.id, form);
      // Refresca los datos del usuario en el contexto
      const updated = await authService.me();
      const token   = sessionStorage.getItem('access_token')!;
      login(token, updated);
      setSuccess('Perfil actualizado correctamente.');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al actualizar el perfil.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es irreversible.'))
      return;

    try {
      await usersService.delete(user!.id);
      logout();
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || 'No se puede eliminar la cuenta (puede tener tareas asignadas).');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Mi Perfil</h1>
          <p>Gestiona tu información personal</p>
        </div>
      </div>

      <div className="profile-grid">
        {/* Información de la cuenta */}
        <div className="card">
          <h3>Información de la cuenta</h3>
          <div className="info-list">
            <div className="info-item">
              <span className="info-label">Usuario</span>
              <span className="info-value">{user?.username}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Rol</span>
              <span className={`badge badge-${user?.role.toLowerCase()}`}>{user?.role}</span>
            </div>
          </div>
        </div>

        {/* Editar nombre */}
        <div className="card">
          <h3>Editar información</h3>

          {success && <div className="alert alert-success">{success}</div>}
          {error   && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required minLength={3} maxLength={100}
              />
            </div>
            <div className="form-group">
              <label>Apellido</label>
              <input
                type="text" value={form.lastname}
                onChange={(e) => setForm({ ...form, lastname: e.target.value })}
                required minLength={3} maxLength={100}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </form>
        </div>

        {/* Zona de peligro */}
        <div className="card card-danger">
          <h3>⚠️ Zona de peligro</h3>
          <p>
            Eliminar tu cuenta es una acción <strong>irreversible</strong>. 
            Se eliminará toda tu información. No podrás eliminar la cuenta 
            si tienes tareas asignadas.
          </p>
          <button className="btn btn-danger" onClick={handleDeleteAccount}>
            Eliminar mi cuenta
          </button>
        </div>
      </div>
    </div>
  );
};