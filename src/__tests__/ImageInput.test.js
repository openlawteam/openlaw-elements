import React, { useState } from 'react';
import { act } from 'react-dom/test-utils';
import {
  cleanup,
  fireEvent,
  render,
} from '@testing-library/react';
import 'jest-dom/extend-expect';
import { Openlaw } from 'openlaw';

import { ImageInput } from '../ImageInput';
import SampleTemplateText from '../../example/SAMPLE_TEMPLATE';

let parameters;
let compiledTemplate;
let executionResult;
let executedVariables;

beforeEach(() => {
  parameters = {};
  compiledTemplate = Openlaw.compileTemplate(SampleTemplateText).compiledTemplate;
  executionResult = Openlaw.execute(compiledTemplate, {}, parameters).executionResult;
  executedVariables = Openlaw.getExecutedVariables(executionResult, {});
});

afterEach(cleanup);

const base64ImgValue = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNkYPhfz0AEYBxVSF+FAP5FDvcfRYWgAAAAAElFTkSuQmCC';

test('Can render Image', () => {
  const { getByLabelText } = render(
    <ImageInput
      cleanName="Contestant-Picture"
      description="Contestant Picture"
      getValidity={(name, value) => Openlaw.checkValidity(executedVariables[name], value, executionResult)}
      name="Contestant Picture"
      onChange={() => {}}
      openLaw={Openlaw}
      savedValue=""
    />
  );

  getByLabelText(/select contestant picture/i);
});

test('Can render with savedValue', () => {
  const { getByText } = render(
    <ImageInput
      cleanName="Contestant-Picture"
      description="Contestant Picture"
      getValidity={(name, value) => {
        const v = executedVariables.filter(v =>
          Openlaw.getName(v) === name
        );

        return Openlaw.checkValidity(v[0], value, executionResult);
      }}
      name="Contestant Picture"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue={base64ImgValue}
    />
  );

  getByText(/edit contestant picture/i);
  expect(getByText(/edit contestant picture/i).disabled).toBeFalsy();
});

test('Can render with savedValue and open edit dialog', () => {
  const { getByText } = render(
    <ImageInput
      cleanName="Contestant-Picture"
      description="Contestant Picture"
      getValidity={(name, value) => {
        const v = executedVariables.filter(v =>
          Openlaw.getName(v) === name
        );

        return Openlaw.checkValidity(v[0], value, executionResult);
      }}
      name="Contestant Picture"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue={base64ImgValue}
    />
  );

  getByText(/edit contestant picture/i);

  fireEvent.click(getByText(/edit contestant picture/i));
  
  getByText(/save/i);
  getByText(/delete/i);
  getByText(/cancel/i);
});

test('Can delete a savedValue', async () => {
  function FakeApp() {
    const [ img, deleteImg ] = useState(base64ImgValue);

    return (
      <ImageInput
        cleanName="Contestant-Picture"
        description="Contestant Picture"
        getValidity={(name, value) => {
          const v = executedVariables.filter(v =>
            Openlaw.getName(v) === name
          );

          return Openlaw.checkValidity(v[0], value, executionResult);
        }}
        name="Contestant Picture"
        onChange={(name, value) => {
          // value should be `undefined`
          act(() => { deleteImg(value); });
        }}
        onKeyUp={() => {}}
        openLaw={Openlaw}
        savedValue={img || ''}
      />
    );
  }

  const { getByText, getByLabelText } = render(
    <FakeApp />
  );

  getByText(/edit contestant picture/i);

  fireEvent.click(getByText(/edit contestant picture/i));
  fireEvent.click(getByText(/delete/i));

  await new Promise(r => { setTimeout(r); });

  getByLabelText(/select contestant picture/i);
});
