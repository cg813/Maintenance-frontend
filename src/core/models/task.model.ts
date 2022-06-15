import { Comment } from './comment.model';
import { Document } from './document.model';

export interface Task {
  id: string;
  completed: boolean;
  name: string;
  responsible: string;
  targetTime: number;
  timeUnit: number;
  documents: Document[];
  isInternal: boolean;
  maintenance?: { id: string; name?: string };
  completedDate?: Date;
  position: number;
  comments?: Comment[];
}

export const TEMP_PREFIX = '__temp_task_';

export enum TimeUnit {
  seconds = 1,
  minutes = 60,
  hours = 3600,
  days = 86400,
}

export interface MaintenanceTask {
  id: string;
  name: string;
  responsible: string;
  machineId: string;
  maintenance: string;
  maintenanceId: string;
  status: string;
  dueDate: Date;
}

export interface Tasks {
  statuses: { status: string; count: string }[];
  assets: { assetId: string; count: string }[];
  responsible: { responsible: string; count: string }[];
  tasks: MaintenanceTask[];
}

export interface TaskError {
  name?: boolean;
  targetTime?: boolean;
  timeUnit?: boolean;
}

export interface TaskErrors {
  [key: string]: TaskError;
}
