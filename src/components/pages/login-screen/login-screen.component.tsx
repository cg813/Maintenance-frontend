import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import classNames from 'classnames';

import styles from './login-screen.module.scss';
import { login } from '../../../core/store/auth/auth.actions';

interface LoginForm {
  username: string;
  password: string;
}

const LoginScreen: FC = () => {
  const dispatch = useDispatch();
  const { handleSubmit, register } = useForm<LoginForm>({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginForm) => {
    dispatch(login(data.username, data.password));
  };

  return (
    <form className={classNames(styles.form)} onSubmit={handleSubmit(onSubmit)}>
      <select id='username' className={classNames(styles.username)} name='username' ref={register}>
        <option value='' selected={true} disabled hidden>
          Username
        </option>
        <option value='administrator'>Administrator</option>
        <option value='manager'>Manager</option>
        <option value='operator'>Operator</option>
      </select>
      <br />
      <input
        className={classNames(styles.input)}
        type='password'
        name='password'
        placeholder='password'
        ref={register}
      />
      <button className={classNames(styles.button)}>login</button>
    </form>
  );
};

export default LoginScreen;
