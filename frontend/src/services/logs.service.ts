import api from '../api/axiosConfig';
import { Log } from '../types';

export interface LogFilters {
  from?:     string;
  to?:       string;
  userId?:   string;
  severity?: string;
  event?:    string;
}

export const logsService = {
  async getLogs(filters: LogFilters = {}): Promise<Log[]> {
    const params = new URLSearchParams();
    if (filters.from)     params.append('from',     filters.from);
    if (filters.to)       params.append('to',       filters.to);
    if (filters.userId)   params.append('userId',   filters.userId);
    if (filters.severity) params.append('severity', filters.severity);
    if (filters.event)    params.append('event',    filters.event);

    const { data } = await api.get<Log[]>(`/logs?${params.toString()}`);
    return data;
  },
};