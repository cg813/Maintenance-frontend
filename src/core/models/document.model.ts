import { File } from './file.model';
import { MaintenanceTask } from './task.model';

export interface DocumentTask {
  id: string;
  name?: string;
}

export interface DocumentMaintenance {
  id: string;
  title?: string;
}

export interface Document {
  id: string;
  file: File;
  title: string;
  ext: string;
  createdAt: Date;
  tasks: Partial<MaintenanceTask>[];
  maintenances: DocumentMaintenance[];
  archive?: boolean;
}
