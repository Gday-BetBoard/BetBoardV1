// Core interfaces for the application
export interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
  edited?: boolean;
  editedAt?: string;
}

export interface Bet {
  id: string;
  owner: string;
  what: string;
  why: string;
  how: string;
  when: string;
  status: 'Open' | 'In Progress' | 'Blocked' | 'Done';
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
  lastUpdated: string;
  createdAt?: string;
  estimatedHours?: number;
  actualHours?: number;
  tags: string[];
  comments: Comment[];
  assignees: string[];
  watchers?: string[];
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    size: number;
    uploadedBy: string;
    uploadedAt: string;
  }>;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  role?: 'Admin' | 'Manager' | 'Member' | 'Viewer';
  avatar?: string;
  department?: string;
  isActive?: boolean;
  lastLogin?: string;
  createdAt?: string;
  permissions?: string[];
}

// API response types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Filter and search types
export interface BetFilters {
  owner?: string;
  status?: Bet['status'];
  priority?: Bet['priority'];
  tags?: string[];
  assignees?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
}

// Toast notification types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Error types
export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, any>;
  timestamp: string;
}

// Authentication types
export interface Session {
  user: User;
  token: string;
  expiresAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Analytics types
export interface BetAnalytics {
  totalBets: number;
  betsByStatus: Record<Bet['status'], number>;
  betsByPriority: Record<string, number>;
  averageCompletionTime: number;
  topPerformers: Array<{
    userId: string;
    userName: string;
    completedBets: number;
  }>;
  trendsOverTime: Array<{
    date: string;
    created: number;
    completed: number;
  }>;
}

// Audit trail types
export interface AuditLog {
  id: string;
  entityType: 'bet' | 'comment' | 'user';
  entityId: string;
  action: 'create' | 'update' | 'delete';
  userId: string;
  userName: string;
  changes: Record<string, { old: any; new: any }>;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

// Real-time updates
export interface WebSocketMessage {
  type: 'bet_updated' | 'comment_added' | 'user_joined' | 'user_left';
  payload: any;
  timestamp: string;
}

// Form types for easier use
export type CreateBetFormData = Omit<Bet, 'id' | 'lastUpdated' | 'createdAt' | 'comments' | 'attachments'>;
export type UpdateBetFormData = Partial<CreateBetFormData>;
export type CreateCommentFormData = Omit<Comment, 'id' | 'date' | 'edited' | 'editedAt'>; 