import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';

import styles from './dropdown.module.scss';
import common from '../../../styles/common';

interface Props {
  className?: string;
  label?: ReactElement | number | string;
  open?: boolean;
  onRequestClose?: () => boolean | void;
  onRequestOpen?: () => boolean | void;
  onClose?: () => void;
  onOpen?: () => void;
  width?: 'auto';
  bodyWidth?: 'auto';
  transparent?: boolean;
  isError?: boolean;
}

const Dropdown: FC<Props> = (props) => {
  const [opened, setOpened] = useState(props.open || false);
  const dropdownClasses = classNames(
    styles.dropdown,
    props.className || null,
    opened ? styles.opened : null,
    props.transparent ? styles.transparent : null,
  );
  const labelClasses = classNames(
    styles.label,
    props.isError && common.forms.error,
    props.width ? styles.autowidth : null,
    'text-nowrap',
  );
  const ref = React.createRef<HTMLDivElement>();

  const close = (open?: boolean) => {
    if (props.onRequestClose) {
      const next = props.onRequestClose();
      if (next !== undefined) {
        setOpened(next);
        return;
      }
    }
    setOpened(open || false);
  };

  const open = () => {
    if (props.onRequestOpen) {
      const next = props.onRequestOpen();
      if (next !== undefined) {
        setOpened(next);
        return;
      }
    }
    setOpened(true);
  };

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        close();
      }
    },
    [ref],
  );

  useEffect(() => {
    if (opened && props.onOpen) {
      props.onOpen();
    }
    if (!opened && props.onClose) {
      props.onClose();
    }
  }, [opened]);

  useEffect(() => {
    if (props.open === opened || props.open === undefined) {
      return;
    }
    setOpened(props.open);
  }, [props.open, setOpened]);

  useEffect(() => {
    close(props.open);
  }, [props.label]);

  useEffect(() => {
    if (opened) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [opened, handleClickOutside]);

  return (
    <div className={dropdownClasses} ref={ref}>
      <span className={labelClasses}>{props.label}</span>
      <button className={styles.arrow} onClick={() => (opened ? close() : open())} />
      {opened && (
        <div style={props.bodyWidth ? { width: 'auto' } : {}} className={styles.body}>
          {props.children}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
