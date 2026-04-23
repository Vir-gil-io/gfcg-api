import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { PasswordStrength } from '../components/PasswordStrength';

export const RegisterPage = () => {
  const [form, setForm] = useState({
    name:     '',
    lastname: '',
    username: '',
    password: '',
    confirm:  '',
  });
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = (): string | null => {
    if (form.password !== form.confirm)
      return 'Las contraseñas no coinciden.';

    const strongPwd =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        form.password,
      );
    if (!strongPwd)
      return 'La contraseña debe tener mínimo 8 caracteres, mayúscula, minúscula, número y carácter especial.';

    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    try {
      await authService.register({
        name:     form.name,
        lastname: form.lastname,
        username: form.username,
        password: form.password,
      });
      setSuccess('¡Cuenta creada! Redirigiendo al login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al registrar. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card auth-card-wide">
        <div className="auth-header">
          <h1>📝</h1>
          <h2>Crear Cuenta</h2>
        </div>

        {error   && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label>Nombre</label>
              <input
                name="name" type="text" value={form.name}
                onChange={handleChange} required minLength={3} maxLength={100}
                placeholder="Juan"
              />
            </div>
            <div className="form-group">
              <label>Apellido</label>
              <input
                name="lastname" type="text" value={form.lastname}
                onChange={handleChange} required minLength={3} maxLength={100}
                placeholder="Pérez"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Nombre de usuario</label>
            <input
              name="username" type="text" value={form.username}
              onChange={handleChange} required minLength={3} maxLength={50}
              placeholder="juan.perez"
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              name="password" type="password" value={form.password}
              onChange={handleChange} required minLength={8} maxLength={100}
              placeholder="Mín. 8 caracteres, mayús, núm y especial"
              autoComplete="new-password"
            />
            <PasswordStrength password={form.password} />
          </div>

          <div className="form-group">
            <label>Confirmar contraseña</label>
            <input
              name="confirm" type="password" value={form.confirm}
              onChange={handleChange} required
              placeholder="Repite tu contraseña"
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>

        <p className="auth-footer">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
};