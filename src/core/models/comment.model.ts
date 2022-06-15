export interface Comment {
  id: string;
  duration: number;
  timeUnit: number;
  responsible?: string;
  comment: string;
  maintenance?: { id: string };
  task?: { id: string };
}
