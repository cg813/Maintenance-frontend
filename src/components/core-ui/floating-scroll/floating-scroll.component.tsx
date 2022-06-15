import React, { FC, MutableRefObject, useEffect, useLayoutEffect, useRef, useState } from 'react';
import ReactResizeDetector from 'react-resize-detector';

import styles from './floating-scroll.module.scss';

const FloatingScroll: FC = ({ children }) => {
  const [width, setWidth] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const [scrollTarget, setScrollTarget] = useState<string>('');
  const wrapperReference = useRef<HTMLDivElement|null>(null);
  const scrollReference = useRef<HTMLDivElement|null>(null);
  const [timeout, createTimeout] = useState<number>();

  useLayoutEffect(() => {
    if (wrapperReference.current && scrollReference.current) {
      if (scrollTarget === 'wrapper') {
        wrapperReference.current.scrollLeft = scrollLeft;
      } else if (scrollTarget === 'scroll') {
        scrollReference.current.scrollLeft = scrollLeft;
      }
    }

    if (timeout) {
      clearTimeout(timeout);
    } else {
      createTimeout(setTimeout(() => setScrollTarget(''), 500) as unknown as number);
    }
  }, [scrollLeft, wrapperReference, scrollReference]);

  const scroll = (length: number, target: string) => {
    setScrollTarget(target);
    setScrollLeft(length);
  };

  return (
    <div>
      <div
        className={styles.wrapper}
        ref={wrapperReference}
        onScroll={(event) => scroll(event.currentTarget.scrollLeft, 'scroll')}
      >
        <div className='d-table w-100'>
          <ReactResizeDetector handleWidth onResize={setWidth}>
          </ReactResizeDetector>
          {children}
        </div>
      </div>
      <div
        className={styles.scroll}
        ref={scrollReference}
        onScroll={(event) => scroll(event.currentTarget.scrollLeft, 'wrapper')}
      >
        <hr style={{ width }} />
      </div>
    </div>
  );
};

export default FloatingScroll;
