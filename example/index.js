import React from 'react';
import { render } from 'react-dom';

import { attemptAuth } from './auth';
import App from './App';

attemptAuth();

render(<App />, document.getElementById('root'));
