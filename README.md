# OpenLaw Elements

Dynamically render React form components from an OpenLaw template.

## ⚠️ Production-ready status

Currently, OpenLaw is making use of this library in our internal projects, but our aim is to make it as easy to use as possible for others. While the library can be used today (and will likely work as-is), there are some things to note:

1) Our component classnames for CSS are heavily geared toward our internal stylesheets. However, no styles are shipped with this library to make it easier for you to use your own stylesheet.
2) There is currently no proper namespacing (or a way to create one) for CSS classes.
3) There are no unit or integration tests.

We appreciate your patience as we make these improvements in our forthcoming releases.

## Install

```
npm install --save openlaw-elements@beta
```

## Usage

### A note about dependencies' CSS

Before using the `<OpenLawForm />` component in your bundled app, be sure to add a way to import CSS into your bundle. While we don't have any of our own styles in the library, we rely on `flatpickr` for dates and `react-image-crop` for images. As an example, using Webpack's [css-loader](https://github.com/webpack-contrib/css-loader) or [style-loader](https://github.com/webpack-contrib/style-loader) you will be ready to load styles. If you are using [create-react-app](https://github.com/facebook/create-react-app) this is already done for you.

### Using the component

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { APIClient, Openlaw } from 'openlaw';
import { OpenLawForm } from 'openlaw-elements';

// OpenLaw APIClient: https://docs.openlaw.io/api-client/#authentication
//  - Used to fetch geo data in our `Address` field type
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

// * all props, except textLikeInputClass are required *
const App = () => (
  <OpenLawForm
    apiClient={apiClient}
    executionResult={executionResult}
    parameters={parameters}
    onChangeFunction={onChange}
    // https://docs.openlaw.io/openlaw-object/
    openLaw={Openlaw}
    // Optional: This is utilized to apply a class to all elements that present as text input
    textLikeInputClass="input"
    // Optional: This will disable collapsible behavior on Collapsible elements when true
    triggerDisabled=false
    variables={variables}
  />
);

ReactDOM.render(<App />, document.getElementById('your-id-here'));
```

## Running the example app

### Authenticating to the `APIClient`

If you would like to use our Address input type, please authenticate by sending your OpenLaw login details to the `npm start` command:

```
OPENLAW_EMAIL=alex@email.com OPENLAW_PASSWORD=password npm start
```

*NOTE:* If you do not provide credentials, the app will still run, but you will not be able to select an address lookup from the drop-down, nor be able to see the values in the rendered preview HTML.

### About the app
The example app (`openlaw-elements/example`) can help you gain ideas and understanding to build your own OpenLaw app in JavaScript and React. In contrast to the example app, the "Usage" section above intentially leaves out more complex behavior to simply illustrate the required dependencies in order to use `<OpenLawForm />` correctly.

We use Webpack to bundle a small app that changes the app's state tree every time an edit is made to the rendered `<OpenLawForm />`. Additionally, each time you click the `Preview` button, it will generate a preview of what the final document will look like at the top of the webpage.

### Run
```
git clone git@github.com:openlawteam/openlaw-elements.git
cd openlaw-elements
npm install
npm start

// Now you can visit http://localhost:3001 and see the app running.
```

## Roadmap (subject to change)

- [ ] User can override individual input components
- [ ] Style classNames can be namespaced to your provided namespace key (e.g. `my-app`)
- [ ] Style configuration prop to override certain element classes (e.g. `{ error: 'my-error-class' }`)
- [ ] Address input type will be able to be used without the `APIClient`
- [ ] Ability to choose input labels and/or placeholders. A current workaround is to hide them with your own CSS.
- [ ] Ability to enable or disable collapsible sections (generated from the template sections)
