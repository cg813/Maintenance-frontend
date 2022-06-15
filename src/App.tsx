import React, { FC } from 'react';
import { HashRouter } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import classNames from 'classnames';
import ReduxToastr from 'react-redux-toastr';

import Routes from './router/routes.component';
import AuthRoutes from './router/auth-routes.component';
import { FactoryTree, Header } from './components/layout';
import { CompleteMaintenance, CreateEditMaintenance } from './components/modals';
import { store } from './core/store';
import styles from './styles.module.scss';
import { selectSidebarState } from './core/store/ui/ui.selectors';
import { AuthGuard } from './core/guards';

const Content: FC = () => {
  const sidebarOpened = useSelector(selectSidebarState);

  return (
    <div className={classNames(!sidebarOpened && styles.collapsed, styles.page)}>
      <AuthRoutes />
    </div>
  );
};

const App: FC = () => (
  <Provider store={store}>
    <HashRouter basename='/'>
      <AuthGuard authorized>
        <Header />
        <div className={styles.content}>
          <FactoryTree />
          <Content />
          <CreateEditMaintenance />
          <CompleteMaintenance />
        </div>
      </AuthGuard>
      <AuthGuard authorized={false}>
        <Routes />
      </AuthGuard>
      <ReduxToastr
        timeOut={4000}
        newestOnTop={false}
        preventDuplicates
        position='bottom-right'
        transitionIn='fadeIn'
        transitionOut='fadeOut'
        progressBar
        closeOnToastrClick
      />
    </HashRouter>
  </Provider>
);

export default App;
