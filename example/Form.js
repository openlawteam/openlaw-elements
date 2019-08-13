// @flow

import React, { Fragment, useState } from 'react';
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
import '../src/style.scss';

import { apiClientSingleton } from './auth';
import SectionsRenderer from './SectionsRenderer';
import SampleTemplateText from './SAMPLE_TEMPLATE';

type State = {
  executionResult: { [string]: any },
  parameters: { [string]: any },
  variables: Array<{ [string]: any }>,
};

type Props = {
  stateLifter: (State) => void,
};

const { compiledTemplate } = Openlaw.compileTemplate(SampleTemplateText);
const { executionResult: initialExecutionResult } = Openlaw.execute(compiledTemplate, {}, {});

const Form = (props: Props) => {
  const [ result, setNewResult ] = useState({
    executionResult: initialExecutionResult,
    parameters: {},
    variables: Openlaw.getExecutedVariables(initialExecutionResult, {}),
  });

  const onChange = (key, value, validationResult) => {
    if (validationResult && validationResult.isError) return;

    const concatParameters = { ...result.parameters, [key]: value };
    const { compiledTemplate } = Openlaw.compileTemplate(SampleTemplateText);
    const { executionResult, errorMessage } = Openlaw.execute(compiledTemplate, {}, concatParameters);

    if (errorMessage) {
      // eslint-disable-next-line no-undef
      console.error('Openlaw Execution Error:', errorMessage);
      return;
    }

    setNewResult({
      executionResult,
      parameters: concatParameters,
      variables: Openlaw.getExecutedVariables(executionResult, {}),
    });

  };

  const { executionResult, parameters, variables } = result;
    
  props.stateLifter(result);

  return (
    <Fragment>
      {Object.keys(executionResult).length && (
        <OpenLawForm
          apiClient={apiClientSingleton}
          executionResult={executionResult}
          parameters={parameters}
          onChangeFunction={onChange}
          openLaw={Openlaw}
          renderSections={SectionsRenderer}
          sectionTransform={(section, index) => {
            // Transform & shape your sections here!
            // Must return an Object.
            // See the sectionsRenderer below for usage.
            return {
              section,
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
};

export default Form;
