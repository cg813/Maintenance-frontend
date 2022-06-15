import React, { FC, ReactElement } from 'react';
import classNames from 'classnames';

import common from '../../../styles/common';
import * as format from '../../../core/utils/format';
import styles from './table.module.scss';
import { Button } from '../../atomic';
import FloatingScroll from '../floating-scroll/floating-scroll.component';

interface Props {
  tableActions?: ReactElement;
  title?: string;
  columns: string[][];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[];
  RowComponent?: FC<RowProps>;
  ColComponent?: FC<ColProps>;
  RowActions?: FC<ActionProps>;
  className?: string;
  noWrap?: boolean;
  sortable?: boolean;
  onRequestSort?: (target: string) => void;
  target?: string;
  order?: 'ASC' | 'DESC';
  withBackArrow?: boolean;
  onBackArrowClick?: () => void;
}

interface RowProps {
  item: unknown;
  columns: string[];
}

export interface ColProps {
  value: string | Date | number | boolean;
  col: string;
  DefaultCol?: FC<ColProps>;
  item?: unknown;
}

interface ActionProps {
  item: unknown;
}

const Row: FC<RowProps> = ({ children }) => <tr>{children}</tr>;

const Col: FC<ColProps> = ({ value }) => {
  let displayValue = value;

  if (value instanceof Date) {
    displayValue = format.date(value as string | Date);
  } else if (typeof value === 'boolean') {
    displayValue = value ? '1' : '0';
  }

  return <td>{displayValue}</td>;
};

const Table: FC<Props> = ({
  title,
  tableActions,
  columns,
  items,
  RowComponent = Row,
  ColComponent = Col,
  RowActions,
  className,
  noWrap,
  sortable,
  onRequestSort,
  target,
  order,
  withBackArrow = false,
  onBackArrowClick,
}) => {
  const tableClasses = classNames(
    common.table.header,
    'd-flex justify-content-between align-content-center',
  );

  let bodyClasses = classNames(common.table.body, common.table.shadowed, styles.body);

  const orderClass = order === 'ASC' ? styles.asc : styles.desc;

  if (noWrap) {
    bodyClasses = classNames(bodyClasses, styles.nowrap);
  }

  return (
    <div className={className}>
      {title && (
        <div className={tableClasses}>
          <span className={common.table.title}>
            {withBackArrow && (
              <Button
                variant='square'
                color='transparent'
                className='mr-3'
                onClick={onBackArrowClick}
                style={{ marginLeft: -10 }}
              >
                <span className={common.icon.backarrow} />
              </Button>
            )}
            {title}
          </span>
          {tableActions || null}
        </div>
      )}
      <FloatingScroll>
        <table className='w-100'>
          <thead
            className={classNames(common.table.header, styles.columns, sortable && styles.sortable)}
          >
            <tr>
              {columns.map(([key, name]) => (
                <td
                  key={key}
                  onClick={() => (sortable && onRequestSort ? onRequestSort(key) : null)}
                >
                  {name}
                  {sortable ? <span className={target === key ? orderClass : undefined} /> : null}
                </td>
              ))}
              {RowActions ? <td /> : null}
            </tr>
          </thead>
          <tbody className={bodyClasses}>
            {items.map((item) => (
              <RowComponent key={Math.random()} item={item} columns={columns[0]}>
                {columns.map(([key]) => (
                  <ColComponent key={Math.random()} value={item[key]} col={key} DefaultCol={Col} item={item} />
                ))}
                {RowActions ? <RowActions item={item} /> : null}
              </RowComponent>
            ))}
          </tbody>
        </table>
      </FloatingScroll>
    </div>
  );
};

export default Table;
