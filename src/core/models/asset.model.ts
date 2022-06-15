export interface AssetProperty {
  name: string;
  value: string;

  id?: string;
  origin?: string;
  file?: {};
  display?: boolean;
  position?: number;
}

export interface AssetPath {
  id: string;
  name: string;
  level: string;
}

export interface AssetChild {
  id: string;
  name: string;
  type: string;
  description: string;
  level: string;
  iconUrl: string;
  equipmentType: string;
  smallImageId?: string;
  properties: AssetProperty[];
}

export interface AssetTreeItem extends AssetChild {
  children: AssetsTree;
  childrenOrder: string[];
  path?: AssetPath[];
}

export type AssetsTree = AssetTreeItem[];
