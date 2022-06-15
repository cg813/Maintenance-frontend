import React, { FC } from 'react';
import { Switch, Route, RouteProps, Redirect } from 'react-router-dom';

import { LoginScreen } from '../components/pages';

const routes: RouteProps[] = [
  {
    path: '/login',
    exact: true,
    component: LoginScreen,
  },
];

const Routes: FC = () => (
  <Switch>
    {routes.map((route, key) => (
      <Route key={key} {...route} />
    ))}
    <Redirect to='/login' />
  </Switch>
);

export default Routes;
