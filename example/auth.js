/* global process */

import { APIClient } from 'openlaw';

// For logging into your OpenLaw instance: 'https://[YOUR.INSTANCE.URL]';
const INSTANCE_URL = 'https://develop.dev.openlaw.io';

export const apiClientSingleton = new APIClient(INSTANCE_URL);

export const attemptAuth = () => {
  const loginDetails = {
    email: process.env.OPENLAW_EMAIL || '',
    password: process.env.OPENLAW_PASSWORD || '',
  };

  apiClientSingleton
    .login(loginDetails.email, loginDetails.password)
    .catch(error => {
      if (/500/.test(error)) {
        // eslint-disable-next-line no-undef
        console.warn('OpenLaw APIClient: Please authenticate to the APIClient if you wish to use the Address input.');
        return;
      }

      // eslint-disable-next-line no-undef
      console.error('OpenLaw APIClient:', error);
    });
};

