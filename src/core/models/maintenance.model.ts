import { Task } from './task.model';
import { Comment } from './comment.model';
import { File } from './file.model';
import { Document } from './document.model';

export enum IntervalUnit {
  yearly = 31536000,
  monthly = 2592000,
  weekly = 604800,
  daily = 86400,
  hourly = 3600,
  km = 1000,
  no = 1,
}

export interface Maintenance {
  id: string;
  machineId: string;
  title: string;
  status: string;
  description: string;
  dueDate: Date;
  earliestExecTime: Date;
  category: string;
  responsible: string;
  interval: number;
  intervalUnit: IntervalUnit|0;
  files?: File[];
  documents?: Partial<Document>[];
  tasks?: Task[];
  comment?: Comment;
  completed: boolean;
  completedAt: Date;
  plannedTime?: number;
  actuallySpendTime?: number;
  isInternal: boolean;
  useOperatingHours?: boolean;
  dueAt?: number;
  useDistance?: boolean;
  useStrokes?: boolean;
  earliestProcessing?: number;
}

export interface MachinesStatuses {
  machineId: string;
  status: string;
}
