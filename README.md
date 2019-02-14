# OpenLaw Elements

Dynamically render React form components from an OpenLaw template.

## Usage

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { APIClient, Openlaw } from 'openlaw';
import { OpenLawForm } from 'openlaw-elements';

// OpenLaw APIClient: https://docs.openlaw.io/api-client/#authentication
//  - To run against your own private OpenLaw instance: 'https://[YOUR.INSTANCE.URL]';
const apiClient = new APIClient('https://app.openlaw.io');
// we strongly recommend using environment variables, not hard-coded strings.
apiClient.login('[YOUR_OPENLAW_EMAIL]', '[YOUR_OPENLAW_PASSWORD]');

// https://docs.openlaw.io/openlaw-object/#compiletemplate
const {compiledTemplate} = Openlaw.compileTemplate('**Name**: [[First Name]] [[Last Name]]');
// https://docs.openlaw.io/openlaw-object/#execute
const {executionResult, errorMessage} = Openlaw.execute(compiledTemplate, {}, {});
// https://docs.openlaw.io/openlaw-object/#getexecutedvariables
const variables = Openlaw.getExecutedVariables(executionResult, {});
// typically the parameters object will be updated in
// an `onChangeFunction` handler (or in a state manager like Redux or MobX)
// throughout the lifetime of the app
const parameters = {};

// helpful for logging in development, or throwing exceptions at runtime
if (errorMessage) {
  console.error('Openlaw Execution Error:', errorMessage);
}

const onChange = (key, value) => console.log('KEY:', key, 'VALUE:', value);

// * all props are required *
const App = () => (
  <OpenLawForm
    // used to fetch geo data in our `Address` field type
    apiClient={apiClient}
    executionResult={executionResult}
    parameters={parameters}
    onChangeFunction={onChange}
    // https://docs.openlaw.io/openlaw-object/
    openLaw={Openlaw}
    variables={variables}
  />
);

ReactDOM.render(<App />, document.getElementById('your-id-here'));
```

## Running the example app

The example app (`openlaw-elements/example`) can help you gain ideas and understanding to build your own OpenLaw app in JavaScript and React. In contrast to the example app, the "Usage" section above intentially leaves out more complex behavior to simply illustrate the required dependencies in order to use `<OpenLawForm />` correctly.

### About the app's implementation
We use Webpack to bundle a small app that changes the app's state tree every time an edit is made to the rendered `<OpenLawForm />`. Additionally, each time you click the `Preview` button, it will generate a preview of what the final document will look like at the top of the webpage.

```bash
git clone git@github.com:openlawteam/openlaw-elements.git
cd openlaw-elements
npm install
npm start

// Now you can visit http://localhost:3001 and see the app running.
```
