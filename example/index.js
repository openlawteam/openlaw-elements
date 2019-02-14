import React, {Component, Fragment, useEffect, useState} from 'react';
import {render} from 'react-dom';
import {APIClient, Openlaw} from 'openlaw';

import {OpenLawForm} from '../src';
import SampleTemplateText from './SAMPLE_TEMPLATE.txt';
import './style.scss';

/**
 * Example app showing how you can render `OpenLawForm`
 * with a valid OpenLaw template.
 */

// for running against your OpenLaw instance: 'https://[YOUR.INSTANCE.URL]';
const apiClient = new APIClient('https://develop.dev.openlaw.io');
apiClient.login('openlawuser+1@gmail.com', 'OpenLaw2018!');

/**
 * OpenLawForm requires:
 *   - apiClient {object}: OpenLaw helper `new APIClient('...')` instance
 *   - executionResult {object}
 *   - parameters {array}
 *   - onChangeFunction {(key: String, ?value: String, ?force: Boolean) => any}
 *   - openLaw {object}
 *   - variables {array}
 */
class Form extends Component {
  static defaultProps = {
    stateLifter: () => {},
  };

  // trick eslint
  static propTypes = {
    stateLifter: () => {},
  };

  state = {
    definedValues: {},
    executionResult: {},
    parameters: {},
    variables: {},
  };

  componentDidMount() {
    this.update();
  }

  update = (key, value) => {
    const updatedDraftParameters = key
      ? ({
        ...this.state.parameters,
        [key]: value,
      }) : (
        this.state.parameters
      );

    this.setState(({parameters}) => {
      const concatParameters = {...parameters, ...updatedDraftParameters};
      // https://docs.openlaw.io/openlaw-object/#compiletemplate
      const {compiledTemplate} = Openlaw.compileTemplate(SampleTemplateText);
      // https://docs.openlaw.io/openlaw-object/#execute
      const {executionResult, errorMessage} = Openlaw.execute(compiledTemplate, {}, concatParameters);

      if (errorMessage) {
        // eslint-disable-next-line no-undef
        console.error('Openlaw Execution Error:', errorMessage);
        return;
      }

      const state = {
        executionResult,
        parameters: concatParameters,
        // https://docs.openlaw.io/openlaw-object/#getexecutedvariables
        variables: Openlaw.getExecutedVariables(executionResult, {}),
      };

      // send props up
      this.props.stateLifter(state);

      return state;
    });
  };

  render() {
    return (
      <Fragment>
        {Object.keys(this.state.executionResult).length && (
          <OpenLawForm
            apiClient={apiClient}
            executionResult={this.state.executionResult}
            parameters={this.state.parameters}
            onChangeFunction={this.update}
            openLaw={Openlaw}
            variables={this.state.variables}
          />
        )}
      </Fragment>
    );
  }
}

const styles = {
  previewButton: {
    background: '#6c6cff',
    border: 'none',
    color: '#F9F9F9',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '1em',
    padding: '12px 24px',
    position: 'fixed',
    right: 0,
    top: 0,
  },
  pre: {
    wordBreak: 'break-all',
    whiteSpace: 'pre-wrap',
  },
  wrapApp: {
    display: 'flex',
    justifyContent: 'space-between',
  },
};

const renderPreviewHTML = (formState, callback) => () => {
  const {executionResult} = formState;
  const {agreement} = Openlaw.getAgreements(executionResult)[0];

  callback(Openlaw.renderForPreview(agreement, {}, {}));
};

const App = () => {
  const [formState, liftFormState] = useState();
  const [previewHTML, setPreviewHTML] = useState();

  useEffect(() => {
    // Scroll to top if there's a preview
    const previewHTMLElement = document.getElementById('openlaw-preview-html');
    if (previewHTMLElement) previewHTMLElement.scrollIntoView();
  }, [previewHTML]);

  return (
    <div>
      {previewHTML && (
        <Fragment>
          <div
            dangerouslySetInnerHTML={{__html: previewHTML}}
            id="openlaw-preview-html"
          />

          <hr />
        </Fragment>
      )}

      <button
        onClick={renderPreviewHTML(formState, setPreviewHTML)}
        style={styles.previewButton}
      >
        Preview
      </button>

      <div style={styles.wrapApp}>
        <Form stateLifter={liftFormState} />
        <div>
          <pre style={styles.pre}>{SampleTemplateText}</pre>
        </div>
      </div>
    </div>
  );
};

render(<App />, document.getElementById('root'));
