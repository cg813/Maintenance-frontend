import React, { FC } from 'react';
import classNames from 'classnames';

import * as styles from './dropdown-item.module.scss';

interface Props {
  selected?: boolean;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const DropdownItem: FC<Props> = ({
  children,
  selected,
  disabled,
  onClick = () => null,
}) => {
  let dropdownItemClasses = classNames(styles.item);

  if (disabled) {
    dropdownItemClasses = classNames(dropdownItemClasses, styles.disabled);
  }
  if (selected) {
    dropdownItemClasses = classNames(dropdownItemClasses, styles.selected);
  }

  return (
    <div className={dropdownItemClasses} onClick={disabled ? undefined : onClick}>
      {children}
    </div>
  );
};

export default DropdownItem;
