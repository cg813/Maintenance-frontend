import React, { FC, useLayoutEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import styles from './collapse.module.scss';
import common from '../../../styles/common';
import Button from '../button/button.component';

interface Props {
  open: boolean;
  onToggle: () => void;
  className?: string;
  label: string;
}

const Collapse: FC<Props> = ({ open, onToggle, className, label, children }) => {
  const contentReference = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<number>(0);

  const updateHeight = () => {
    if (contentReference.current) {
      setHeight(contentReference.current.clientHeight + 5);
    }
  };

  useLayoutEffect(() => {
    updateHeight();
    setTimeout(updateHeight, 300 /* transition duration */);
  });

  return (
    <div className={classNames('d-flex flex-fill flex-column', className)}>
      <div className='w-100 d-flex align-items-center'>
        <span className={classNames(styles.divider, 'flex-fill')} />
        <Button width='auto' color='transparent' className='px-5' onClick={onToggle}>
          {label}
          <span
            className={classNames(common.icon.assetarrow, !open && styles.collapsed, 'ml-3')}
          />
        </Button>
        <span className={classNames(styles.divider, 'flex-fill')} />
      </div>
      <div
        style={contentReference.current ? { height } : undefined}
        className={classNames(styles.body, !open && styles.collapsed)}
      >
        <div className='w-100 d-flex' ref={contentReference}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Collapse;
