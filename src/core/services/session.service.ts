import Cookies from 'js-cookie';

import { userServiceUrl } from 'core/environment';

interface UserData {
  id: string;
  name: string;
  displayName: string;
  tenant: string;
  email: string;
  preferredLanguage: string;
  iat: string;
  exp: string;
  rnb: string;
}

const getUserData = (): UserData | null => {
  const apiKey = Cookies.get('__dfapps_session');

  if (!apiKey) {
    console.error('No API key in cookies found!');
    return null;
  }
  const credentials = JSON.parse(atob(apiKey.split('.')[1]));
  return credentials;
};

export const getUsername = (): string => {
  const userData = getUserData();
  return userData?.displayName || userData?.name || '';
};

export const signOut = (): void => {
  window.location.href = `${userServiceUrl}/v1/auth/logout`;
};
