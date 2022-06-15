import React, { FC } from 'react';
import classNames from 'classnames';

import styles from './check-box.module.scss';

const CheckBox: FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  checked = false,
  className,
  style,
  disabled,
  ...props
}) => (
  <label
    className={classNames(
      styles.checkbox,
      checked ? styles.checked : null,
      disabled ? styles.disabled : null,
      'mb-0',
      className,
    )}
    style={style}
  >
    <input className='d-none' type='checkbox' disabled={disabled} checked={checked} {...props} />
  </label>
);

export default CheckBox;
