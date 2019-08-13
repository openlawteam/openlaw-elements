import React, { Component, Fragment } from 'react';
import { Openlaw } from 'openlaw';

/**
 * DO NOT COPY the lines below;
 *
 * If your app is bundled and using our `esm/ lib,
 * in your app they will become:
 *   import OpenLawForm from 'openlaw-elements';
 *   import 'openlaw-elements/dist/esm/openlaw-elements.min.css';
 */
import OpenLawForm from '../src';
import '../src/style.scss';

import { apiClientSingleton } from './auth';
import SectionsRenderer from './SectionsRenderer';
import SampleTemplateText from './SAMPLE_TEMPLATE';

const styles = {
  wrap: {
    width: '100%',
  },
  wrapForm: {
    marginRight: 24,
  },
};

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
    executionResult: {},
    parameters: {},
    variables: [],
  };

  componentDidMount() {
    this.update();
  }

  update = (key, value, validationResult) => {
    // don't run execution if there's errors
    if (validationResult && validationResult.isError) return;

    const updatedDraftParameters = key
      ? ({
        ...this.state.parameters,
        [key]: value,
      }) : (
        this.state.parameters
      );

    this.setState(({ parameters }) => {
      const concatParameters = { ...parameters, ...updatedDraftParameters };
      // https://docs.openlaw.io/openlaw-object/#compiletemplate
      const { compiledTemplate } = Openlaw.compileTemplate(SampleTemplateText);
      // https://docs.openlaw.io/openlaw-object/#execute
      const { executionResult, errorMessage } = Openlaw.execute(compiledTemplate, {}, concatParameters);

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
        <div style={{ ...styles.wrap, ...styles.wrapForm }}>
          {Object.keys(this.state.executionResult).length && (
            <OpenLawForm
              apiClient={apiClientSingleton}
              executionResult={this.state.executionResult}
              parameters={this.state.parameters}
              onChangeFunction={this.update}
              onValidate={this.onValidate}
              openLaw={Openlaw}
              renderSections={SectionsRenderer}
              sectionTransform={(section, index) => {
                // Transform & shape your sections here!
                // Must return an Object.
                // See the sectionsRenderer below for usage.
                return { section, mySuperCustomKey: `${index + 1}. `, index };
              }}
              unsectionedTitle="" // none, don't create a section
              variables={this.state.variables}
            />
          )}
        </div>
      </Fragment>
    );
  }
}

export default Form;
