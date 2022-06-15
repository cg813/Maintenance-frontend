import { AssetTreeNodeDto } from 'shared/common/models';

export const getChildrenFlat = (treeItem: AssetTreeNodeDto): AssetTreeNodeDto[] => {
  const children: AssetTreeNodeDto[] = [];

  function traverse(treeItem: AssetTreeNodeDto) {
    for (const child of treeItem?.children || []) {
      children.push(child);
      if (child.children?.length) {
        traverse(child);
      }
    }
  }
  traverse(treeItem);
  return children;
};
