import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/auth.service';

export const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await authService.logout(); } catch { /* ignorar */ }
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">🔐 TaskApp Segura</Link>
      </div>
      <div className="navbar-links">
        <Link to="/dashboard">Mis Tareas</Link>
        <Link to="/profile">Mi Perfil</Link>
        {isAdmin && (
          <>
            <Link to="/admin/users">Usuarios</Link>
            <Link to="/admin/logs">Auditoría</Link>
          </>
        )}
        <span className="navbar-user">
          {user.name} <span className={`badge badge-${user.role.toLowerCase()}`}>{user.role}</span>
        </span>
        <button className="btn btn-outline" onClick={handleLogout}>Salir</button>
      </div>
    </nav>
  );
};