export interface FileExifInfo {
  [key: string]: string | number | boolean | object;
}

export interface FilePropertiesData {
  [key: string]: string | number | boolean | object;
}

export interface File {
  id: string;
  name: string;
  maintenance?: { id: string };
  tasks?: { id: string; name?: string }[];
}
