import { AxiosError } from 'axios';
import { toastr } from 'react-redux-toastr';

export default (error: Error, actionName: string) => {
  console.log('Action name:', actionName); // eslint-disable-line no-console
  console.log('Error stack:', error); // eslint-disable-line no-console

  const err = error as AxiosError;
  if (err.response && err.response.status === 403) {
    toastr.error('Error', 'Sie haben nicht die entsprechenden Rechte für diese Aktion.');
  }
};
