# OpenLaw Elements

Dynamically render React form components from an OpenLaw template.

## ⚠️ Production-ready status

Currently, OpenLaw is making use of this library in our internal projects, but our aim is to make it as easy to use as possible for others. While the library can be used today (and will likely work as-is), we kindly ask that you help us by reporting any bugs - and do ask us any questions - if you decide to use it.

We appreciate your patience as we make improvements in our forthcoming releases.

## Install

```
npm install --save openlaw-elements@beta
```

## Usage

The example below shows usage in a bundled app (e.g. using Webpack), or create-react-app.

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { APIClient, Openlaw } from 'openlaw';
import OpenLawForm from 'openlaw-elements';
// our optional base styles - feel free to use them!
import 'openlaw-elements/dist/openlaw-elements.min.css';

// OpenLaw APIClient: https://docs.openlaw.io/api-client/#authentication
//  - used to fetch geo data in our `Address` field type
//  - to run against your own private OpenLaw instance: 'https://[YOUR.INSTANCE.URL]';
const apiClient = new APIClient('https://app.openlaw.io');
// we strongly recommend using environment variables, not hard-coded strings
apiClient.login('[YOUR_OPENLAW_EMAIL]', '[YOUR_OPENLAW_PASSWORD]');

// https://docs.openlaw.io/openlaw-object/#compiletemplate
const { compiledTemplate } = Openlaw.compileTemplate('**Name**: [[First Name]] [[Last Name]]');
// https://docs.openlaw.io/openlaw-object/#execute
const { executionResult, errorMessage } = Openlaw.execute(compiledTemplate, {}, {});
// https://docs.openlaw.io/openlaw-object/#getexecutedvariables
const variables = Openlaw.getExecutedVariables(executionResult, {});
// typically the parameters object will be updated in state via 
// an `onChangeFunction` handler (or in a state manager like Redux
// or MobX) throughout the lifetime of the app
const parameters = {};

// helpful for logging in development, or throwing exceptions at runtime
if (errorMessage) {
  console.error('Openlaw Execution Error:', errorMessage);
}

const onChange = (key, value) => console.log('KEY:', key, 'VALUE:', value);

const App = () => (
  <OpenLawForm
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

### Using our default styles

Our component comes with a separate file of base styles which you can include in your app JS (via an `import`) or HTML. If you decide to import the styles into your JS, be sure to add a way to import CSS into your bundle. As an example, using Webpack's [css-loader](https://github.com/webpack-contrib/css-loader) + [style-loader](https://github.com/webpack-contrib/style-loader). If you are using [create-react-app](https://github.com/facebook/create-react-app) this is already done for you.

#### Including the styles

Via JavaScript `import`:

```js
import 'openlaw-elements/dist/openlaw-elements.min.css';
```

If you'd like to load the styles via an HTML file, you can copy the path (or file):

```html
<link
  rel="stylesheet"
  type="text/css"
  href="node_modules/openlaw-elements/dist/openlaw-elements.min.css"
  <!-- or your path -->
>
```

#### Overriding our styles

If you want to leave out our styles, that's completely OK. We've set up our components with simple classnames so you can target what you need to, easily. Just add your own stylesheet and take a look at what classes and elements you can style. We find the simplest way to prototype can be using browser developer tools.

### Optional Parameters

In addition to the required parameters, we offer support for additional parameters that will give you more flexibility to apply styles and render custom form sections. You can check out our [OpenLaw Elements docs](https://docs.openlaw.io/openlaw-elements/) for more details.

### OpenLaw dependency

As OpenLaw Elements depends on the [openlaw](https://www.npmjs.com/package/openlaw) package, we recommend always using the [latest](https://www.npmjs.com/package/openlaw/v/latest) version.

## Running the example app

### Authenticating to the `APIClient`

If you would like to use our Address or input type, please authenticate by sending your OpenLaw login details to the `npm start` command:

```
OPENLAW_EMAIL=alex@email.com OPENLAW_PASSWORD=password npm start
```

*NOTE:* If you do not provide credentials the app will still run, but you will not be able to:

* Select an Address lookup from the drop-down
* See those values in the rendered preview HTML

### About the app

The example app (`openlaw-elements/example`) can help you gain ideas and understanding to build your own OpenLaw app in JavaScript and React. In contrast to the example app, the "Usage" section above intentionally leaves out more complex behavior to simply illustrate the required dependencies in order to use `<OpenLawForm />` correctly.

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

## Contributing 

See information about contributing [here](https://github.com/openlawteam/openlaw-elements/blob/master/CONTRIBUTING.md).

## License

Copyright 2019 Aaron Wright, David Roon, and ConsenSys AG.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
