import React, { FC } from 'react';
import classNames from 'classnames';

import styles from './breadcrumbs.module.scss';

interface Breadcrumb {
  name: string;
  link: string;
  level?: number;
}

interface Props {
  breadcrumbs: Breadcrumb[];
  vertical?: boolean;
}

const mapLevelToClass = [
  styles.home,
  styles.factory,
  styles.scrap,
  styles.machine,
];

const Breadcrumbs: FC<Props> = ({ breadcrumbs, vertical }) => (
  <div className={classNames(vertical && styles.vertical, 'd-flex')}>
    <div>
      {breadcrumbs.map((breadcrumb) => (
        <span key={breadcrumb.link} className={
          classNames(
            styles.breadcrumb,
            (vertical && breadcrumb.level != null)
              ? mapLevelToClass[breadcrumb.level]
              : null,
          )
        }>
          {breadcrumb.name}
        </span>
      ))}
    </div>
  </div>
);

export default Breadcrumbs;
