import React, { CSSProperties, FC } from 'react';
import classNames from 'classnames';

import styles from './button.module.scss';

interface Props {
  variant?: 'outline' | 'common' | 'reference' | 'square' | 'link';
  color?: 'black' | 'yellow' | 'red' | 'green' | 'transparent' | 'dark';
  icon?: string;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  style?: CSSProperties;
  width?: 'auto';
  disabled?: boolean;
}

const Button: FC<Props> = ({ children, onClick = () => null, ...props }) => {
  let buttonClasses = classNames(styles.button, props.className || '');

  switch (props.variant) {
    case undefined:
    case 'common':
      buttonClasses = classNames(buttonClasses, styles.common);
      break;
    case 'outline':
      buttonClasses = classNames(buttonClasses, styles.outline);
      break;
    case 'reference':
      buttonClasses = classNames(buttonClasses, styles.reference);
      break;
    case 'square':
      buttonClasses = classNames(buttonClasses, styles.square);
      break;
    case 'link':
      buttonClasses = classNames(buttonClasses, styles.link);
      break;
    default:
      break;
  }

  switch (props.color) {
    case 'black':
      buttonClasses = classNames(buttonClasses, styles.black);
      break;
    case 'red':
      buttonClasses = classNames(buttonClasses, styles.red);
      break;
    case 'yellow':
      buttonClasses = classNames(buttonClasses, styles.yellow);
      break;
    case 'green':
      buttonClasses = classNames(buttonClasses, styles.green);
      break;
    case 'transparent':
      buttonClasses = classNames(buttonClasses, styles.transparent);
      break;
    case 'dark':
      buttonClasses = classNames(buttonClasses, styles.dark);
      break;
    default:
      break;
  }

  if (props.width === 'auto') {
    buttonClasses = classNames(buttonClasses, styles.autowidth);
  }

  return (
    <button
      className={buttonClasses}
      style={props.style}
      onClick={onClick}
      disabled={props.disabled}
    >{children}</button>
  );
};

export default Button;
