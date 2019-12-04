/* global process */

import { APIClient } from 'openlaw';

const { OPENLAW_EMAIL, OPENLAW_INSTANCE_NAME, OPENLAW_PASSWORD } = process.env;

// Provide your OPENLAW_INSTANCE_NAME for logging into your OpenLaw instance.
const INSTANCE_URL = `https://lib.openlaw.io/api/v1/${OPENLAW_INSTANCE_NAME.toLowerCase() || 'default'}`;

export const apiClientSingleton = new APIClient(INSTANCE_URL);

export const attemptAuth = () => {
  const loginDetails = {
    email: OPENLAW_EMAIL || '',
    password: OPENLAW_PASSWORD || '',
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

