import React from 'react';
import ReactDOM from 'react-dom';
import ReactModal from 'react-modal';
import { pdfjs } from 'react-pdf';
import i18n, { ResourceLanguage } from 'i18next';
import { initReactI18next } from 'react-i18next';

import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
// eslint-disable-next-line import/no-unresolved
import 'react-datepicker/dist/react-datepicker.css';
import './styles/base.scss';
import en from './i18n/en.json';
import de from './i18n/de.json';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

if (ReactModal.defaultStyles.overlay) {
  ReactModal.defaultStyles = {
    overlay: {
      ...ReactModal.defaultStyles.overlay,
      zIndex: 10000,
      background: '#000000A8',
      overflow: 'auto',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      ...ReactModal.defaultStyles.content,
      padding: 0,
      bottom: 'unset',
      right: 'unset',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      border: '1px solid #DBDBDB',
      borderRadius: 5,
      overflow: 'visible',
    },
  };
}

const appRoot: HTMLElement = document.getElementById('root') as HTMLElement;

ReactModal.setAppElement(appRoot);

i18n.use(initReactI18next).init({
  resources: {
    en: en as ResourceLanguage,
    de: de as ResourceLanguage,
  },
  lng: localStorage.getItem('lang') || 'de',
});

ReactDOM.render(<App />, appRoot);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
