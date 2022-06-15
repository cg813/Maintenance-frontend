import React, { FC, useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import classNames from 'classnames';
import ReactResizeDetector from 'react-resize-detector';

import styles from './truncate-text.module.scss';

interface Props {
  width?: string|number;
  maxWidth?: string|number;
  className?: string;
  onClick?: () => void;
}

const TruncateText: FC<Props> = ({
  className,
  width,
  maxWidth,
  children,
  onClick,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [textWidth, setTextWidth] = useState<number>(0);
  const [wrapperWidth, setWrapperWidth] = useState<number>(0);

  const handleOpenModal = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (onClick) {
      onClick();
    } else {
      setIsOpen(true);
    }
  };

  return (
    <div
      className={classNames(
        'text-ellipsis position-relative',
        textWidth > wrapperWidth && styles.truncate,
        className,
      )}
      style={{ width, maxWidth }}
    >
      <ReactResizeDetector handleWidth onResize={setWrapperWidth} />
      <div className='d-table position-absolute z-index-minus'>
        <ReactResizeDetector handleWidth onResize={setTextWidth} />
        <span className='w-100'>
          {children}
        </span>
      </div>
      <span onClick={handleOpenModal} className='w-100 position-relative'>
        {!isOpen && (
          <div className='w-100 h-100 position-absolute top-0'><hr className='border-0'/></div>
        )}
        {children}
      </span>
      { textWidth > wrapperWidth && (
        <ReactModal
          isOpen={isOpen}
          onRequestClose={() => setIsOpen(false)}
          style={{ content: { maxWidth: '50%', overflow: 'auto' } }}
        >
          <div className='px-5 py-4 text-break'>
            {children}
          </div>
        </ReactModal>
      ) }
    </div>
  );
};

export default TruncateText;
