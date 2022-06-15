import React, { FC } from 'react';
import classNames from 'classnames';

import styles from './balloon.module.scss';

interface Props {
  color: 'black' | 'red' | 'green' | 'yellow';
  label: string;
  num: number;
  active?: boolean;
  hidden?: boolean;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const Balloon: FC<Props> = ({
  color,
  label,
  num,
  active,
  hidden,
  disabled,
  onClick = () => null,
}) => {
  let balloonClasses = classNames(styles.balloon);

  switch (color) {
    case 'black':
      balloonClasses = classNames(balloonClasses, styles.black);
      break;
    case 'red':
      balloonClasses = classNames(balloonClasses, styles.red);
      break;
    case 'green':
      balloonClasses = classNames(balloonClasses, styles.green);
      break;
    case 'yellow':
      balloonClasses = classNames(balloonClasses, styles.yellow);
      break;
    default:
      break;
  }

  if (active) {
    balloonClasses = classNames(balloonClasses, styles.active);
  }

  if (hidden) {
    balloonClasses = classNames(balloonClasses, styles.hidden);
  }

  if (disabled) {
    balloonClasses = classNames(balloonClasses, styles.disabled);
  }

  return (
    <div className={balloonClasses} onClick={disabled ? undefined : onClick}>
      <span className={styles.label}>{label}</span>
      <span className='d-flex justify-content-between'>
        <span className={styles.number}>{num}</span>
        <span className={classNames(styles.goarrow, 'align-self-end mb-1')} />
      </span>
    </div>
  );
};

export default Balloon;
