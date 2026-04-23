import { useState, useEffect, type FormEvent } from 'react';
import { logsService, type LogFilters } from '../../services/logs.service';
import type { Log } from '../../types';

const SEVERITIES = ['', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'];

const severityColor: Record<string, string> = {
  INFO:     '#2d6a4f',
  WARNING:  '#f77f00',
  ERROR:    '#e63946',
  CRITICAL: '#6a040f',
};

export const LogsPage = () => {
  const [logs,    setLogs]    = useState<Log[]>([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [filters, setFilters] = useState<LogFilters>({
    from: '', to: '', userId: '', severity: '', event: '',
  });

  const loadLogs = async (f: LogFilters = {}) => {
    try {
      setLoading(true);
      setError('');
      const data = await logsService.getLogs(f);
      setLogs(data);
    } catch {
      setError('Error al cargar los registros de auditoría.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadLogs(); }, []);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    // Limpiar filtros vacíos
    const clean = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== ''),
    );
    loadLogs(clean);
  };

  const handleReset = () => {
    setFilters({ from: '', to: '', userId: '', severity: '', event: '' });
    loadLogs();
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Registros de Auditoría</h1>
          <p>Eventos críticos del sistema — solo ADMIN puede consultar</p>
        </div>
        <span className="badge badge-admin">Solo ADMIN</span>
      </div>

      {/* Filtros */}
      <div className="card filter-card">
        <h3>🔍 Filtros</h3>
        <form onSubmit={handleSearch} className="filter-form">
          <div className="form-group">
            <label>Desde</label>
            <input
              type="date" value={filters.from}
              onChange={(e) => setFilters({ ...filters, from: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Hasta</label>
            <input
              type="date" value={filters.to}
              onChange={(e) => setFilters({ ...filters, to: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>ID Usuario</label>
            <input
              type="number" placeholder="ej. 2" value={filters.userId}
              onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Severidad</label>
            <select
              value={filters.severity}
              onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
            >
              {SEVERITIES.map((s) => (
                <option key={s} value={s}>{s || 'Todas'}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Evento (texto)</label>
            <input
              type="text" placeholder="ej. Login fallido" value={filters.event}
              onChange={(e) => setFilters({ ...filters, event: e.target.value })}
            />
          </div>
          <div className="filter-actions">
            <button type="submit" className="btn btn-primary">Buscar</button>
            <button type="button" className="btn btn-outline" onClick={handleReset}>Limpiar</button>
          </div>
        </form>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading">Cargando registros...</div>
      ) : (
        <div className="card">
          <div className="logs-summary">
            <strong>{logs.length}</strong> registro(s) encontrado(s)
          </div>
          <div className="table-responsive">
            <table className="table table-logs">
              <thead>
                <tr>
                  <th>Fecha / Hora</th>
                  <th>Severidad</th>
                  <th>Evento</th>
                  <th>Usuario</th>
                  <th>Ruta</th>
                  <th>Código</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-muted">
                      No hay registros con los filtros seleccionados
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id}>
                      <td className="log-date">
                        {new Date(log.timeStamp).toLocaleString('es-MX')}
                      </td>
                      <td>
                        <span
                          className="badge"
                          style={{ backgroundColor: severityColor[log.severity] ?? '#6c757d' }}
                        >
                          {log.severity}
                        </span>
                      </td>
                      <td className="log-event">{log.event ?? log.error}</td>
                      <td>
                        {log.user ? (
                          <>
                            <code>{log.user.username}</code>
                            <br />
                            <small className="text-muted">{log.user.role}</small>
                          </>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td><code>{log.path}</code></td>
                      <td><code>{log.statusCode}</code></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};