// @flow

import React, { Component, Fragment } from 'react';
import { Openlaw } from 'openlaw';

/**
 * DO NOT DIRECTLY COPY the lines below;
 *
 * If your app is bundled and using our `esm/ lib,
 * in your app they will become:
 *   import OpenLawForm from 'openlaw-elements';
 *   import 'openlaw-elements/dist/esm/openlaw-elements.min.css';
 */
import OpenLawForm from '../src';
// $FlowFixMe
import '../src/style.scss';

import { apiClientSingleton } from './auth';
import SectionsRenderer from './SectionsRenderer';
import SampleTemplateText from './SAMPLE_TEMPLATE';
import type { FieldErrorType } from '../src/flowTypes';

type Props = {
  stateLifter: (State) => void,
};

type State = {
  executionResult: { [string]: any },
  parameters: { [string]: any },
  variables: Array<{ [string]: any }>,
};

const onValidate = (validationResult) => {
  // Custom validation
  //
  // Return an errorMessage key to provide your own
  // or override & hide a validation error with an empty string.
  if (
    validationResult.elementType === 'Text'
    && validationResult.eventType === 'blur'
    && validationResult.elementName === 'Contestant-Name'
    && validationResult.value !== 'Smoky'
  ) {
    return {
      errorMessage: 'Please, only participants with the name "Smoky" can enter.',
    };
  }
};

/**
* Form
*
* NOTE: It's recommended to use a Class component as it's easier to use instance methods
* as props for on[Event] functions which do not cause unnecessary PureComponent rendering farther down.
* InputRenderer caches (and updates if changed) other props where necessary (e.g. inputProps).
*/
class Form extends Component<Props, State> {
  // set some initial state values
  compiledTemplate = Openlaw.compileTemplate(SampleTemplateText).compiledTemplate;
  initialExecutionResult = Openlaw.execute(this.compiledTemplate, {}, {}).executionResult;
  initialVariables = Openlaw.getExecutedVariables(this.initialExecutionResult, {});

  state = {
    executionResult: this.initialExecutionResult,
    parameters: {},
    variables: this.initialVariables,
  };

  onElementChange = (key: string, value: string, validationResult: FieldErrorType) => {
    if (validationResult && validationResult.isError) return;

    const { stateLifter } = this.props;
    const { parameters } = this.state;

    const mergedParameters = { ...parameters, [key]: value };
    const { executionResult, errorMessage } = Openlaw.execute(this.compiledTemplate, {}, mergedParameters);

    if (errorMessage) {
      // eslint-disable-next-line no-undef
      console.error('Openlaw Execution Error:', errorMessage);
      return;
    }

    this.setState({
      executionResult,
      parameters: mergedParameters,
      variables: Openlaw.getExecutedVariables(executionResult, {}),
    }, () => {
      stateLifter(this.state);
    });
  };
  
  render() {
    const { executionResult, parameters, variables } = this.state;

    return (
      <Fragment>
        {Object.keys(executionResult).length && (
          <OpenLawForm
            apiClient={apiClientSingleton}
            executionResult={executionResult}
            parameters={parameters}
            onChangeFunction={this.onElementChange}
            onValidate={onValidate}
            openLaw={Openlaw}
            renderSections={SectionsRenderer}
            sectionTransform={(sectionName: string, index: number) => {
              // Transform & shape your custom sections here!
              // See <SectionsRenderer /> for usage.
              return {
                section: sectionName,
                mySuperCustomKey: `${index + 1}. `,
                index,
              };
            }}
            unsectionedTitle="" // none, don't create a section
            variables={variables}
          />
        )}
      </Fragment>
    );
  }
}

export default Form;
