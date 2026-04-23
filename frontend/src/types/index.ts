export interface User {
  id: number;
  name: string;
  lastname: string;
  username: string;
  role: string;
  created_at: string;
}

export interface Task {
  id: number;
  name: string;
  description: string;
  priority: boolean;
  created_at: string;
  user_id: number;
}

export interface Log {
  id: number;
  statusCode: number;
  timeStamp: string;
  path: string;
  error: string;
  errorCode: string;
  event: string | null;
  severity: string;
  session_id: number | null;
  user: {
    id: number;
    name: string;
    username: string;
    role: string;
  } | null;
}

export interface AuthPayload {
  id: number;
  name: string;
  username: string;
  role: string;
  hash: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
}