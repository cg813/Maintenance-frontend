import React, { FC } from 'react';
import { Switch, Route, RouteProps, Redirect } from 'react-router-dom';

import { Documents, MachineDashboard, MaintenanceDetail, Tasks } from '../components/pages';

const routes: RouteProps[] = [
  {
    path: '/machine',
    exact: true,
    component: MachineDashboard,
  },
  {
    path: '/archive',
    exact: true,
    component: MachineDashboard,
  },
  {
    path: '/machine/:id',
    exact: true,
    component: MachineDashboard,
  },
  {
    path: '/archive/:id',
    exact: true,
    component: MachineDashboard,
  },
  {
    path: '/asset/:id',
    exact: true,
    component: MachineDashboard,
  },
  {
    path: '/maintenance/:id',
    exact: true,
    component: MaintenanceDetail,
  },
  {
    path: '/tasks',
    exact: true,
    component: Tasks,
  },
  {
    path: '/documents',
    exact: true,
    component: Documents,
  },
];

const Routes: FC = () => (
  <Switch>
    {routes.map((route, key) => (
      <Route key={key} {...route} />
    ))}
    <Redirect to='/machine' />
  </Switch>
);

export default Routes;
