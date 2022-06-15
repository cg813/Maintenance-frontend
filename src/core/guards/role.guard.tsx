import React, { FC } from 'react';
import { useSelector } from 'react-redux';

import { selectUser } from '../store/auth/auth.selectors';
import AuthGuard from './auth.guard';

interface Props {
  roles: string[];
  not?: boolean;
}

const RoleGuard: FC<Props> = ({ not, roles, children }) => {
  const user = useSelector(selectUser);

  if (!not && roles.includes(user.role) || not && !roles.includes(user.role)) {
    return (
      <AuthGuard authorized>
        {children}
      </AuthGuard>
    );
  }

  return null;
};

export default RoleGuard;
