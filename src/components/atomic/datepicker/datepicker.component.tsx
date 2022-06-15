import React, { FC, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
// eslint-disable-next-line import/no-unresolved
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';
import { FieldError } from 'react-hook-form';
import classNames from 'classnames';

import * as format from '../../../core/utils/format';
import styles from './datepicker.module.scss';
import { DATE_FORMAT, localTimeAsUTC, UTCAsLocalTime } from '../../../core/utils/format';

interface Props extends ReactDatePickerProps {
  datepickerClassName?: string;
  calendarIcon?: boolean;
  error?: FieldError;
}

const Datepicker: FC<Props> = ({
  className,
  wrapperClassName,
  datepickerClassName,
  children,
  dateFormat,
  calendarIcon,
  onChange,
  error,
  ...props
}) => {
  const wrapperReference = useRef<HTMLDivElement|null>(null);
  const datepickerClasses = classNames(styles.datepicker, datepickerClassName, error ? styles.error : null);
  const inputClasses = classNames(styles.input, className, 'd-none');
  let wrapperClasses = classNames(styles.wrapper, wrapperClassName, 'position-absolute');
  let buttonClasses = classNames(styles.button);
  const [focused, setFocus] = useState(false);
  const ref = React.createRef<ReactDatePicker>();
  const buttonReference = React.createRef<HTMLButtonElement>();
  const defaultDateFormat = DATE_FORMAT.replace(/[DY]*/g, (match) => match.toLowerCase());
  const [root, setRoot] = useState<HTMLDivElement>();
  const [interval, updateInterval] = useState<number>();

  useEffect(() => {
    const div = document.createElement('div');
    div.style.position = 'fixed';
    div.style.height = '0';
    div.style.top = '0';
    div.style.zIndex = '1000000';
    document.body.append(div);
    setRoot(div);

    return () => {
      setRoot((previousState) => {
        if (previousState) {
          document.body.removeChild(previousState);
        }
        return undefined;
      });
    };
  }, []);

  const updatePosition = useCallback(() => {
    if (wrapperReference.current && root) {
      root.style.top = `${wrapperReference.current.getClientRects()[0].y + wrapperReference.current.clientHeight}px`;
      root.style.left = `${wrapperReference.current.getClientRects()[0].x}px`;
    }
  }, [wrapperReference, root]);

  useEffect(() => {
    if (focused && !interval) {
      updatePosition();
      updateInterval(setInterval(updatePosition, 500) as unknown as number);
    } else if (!focused) {
      clearInterval(interval as unknown as NodeJS.Timeout);
      updateInterval(0);
    }
  }, [focused, updatePosition]);

  useLayoutEffect(() => {
    updatePosition();
  }, [updatePosition]);

  if (children) {
    wrapperClasses = classNames(wrapperClasses, styles.hidden);
  }

  if (calendarIcon) {
    buttonClasses = classNames(buttonClasses, styles.calendar);
  }

  if (!calendarIcon && focused) {
    buttonClasses = classNames(buttonClasses, styles.collapsed);
  }

  const handleOutsideClick = (event: React.MouseEvent | React.FocusEvent<HTMLInputElement>) => {
    if (event.target !== buttonReference.current) {
      setFocus(false);
    }
  };

  return (
    <div className='position-relative'>
      <div className={datepickerClasses} ref={wrapperReference}>
        {children || props.selected && format.date(props.selected) || null}
        { root
          ? ReactDOM.createPortal(
            <ReactDatePicker
              {...props}
              selected={props.selected ? UTCAsLocalTime(props.selected) : null}
              readOnly
              open={focused}
              className={inputClasses}
              wrapperClassName={wrapperClasses}
              onBlur={handleOutsideClick}
              onClickOutside={handleOutsideClick}
              dateFormat={dateFormat || defaultDateFormat}
              onChange={(date, event) => {
                if (onChange) {
                  onChange(date ? localTimeAsUTC(date) : null, event);
                }
                setFocus(false);
              }}
              maxDate={props.maxDate ? UTCAsLocalTime(props.maxDate) : null}
              minDate={props.minDate ? UTCAsLocalTime(props.minDate) : null}
              ref={ref}
            />,
            root,
          ) : null
        }
      </div>
      <button className={buttonClasses} onClick={() => setFocus(!focused)} ref={buttonReference} />
    </div>
  );
};

export default Datepicker;
