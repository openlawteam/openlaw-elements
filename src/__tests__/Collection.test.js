import React, { useState } from 'react';
import { act } from 'react-dom/test-utils';
import {
  cleanup,
  fireEvent,
  render,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { APIClient, Openlaw } from 'openlaw';

import { OpenLawForm } from '../OpenLawForm';
import SampleTemplate from '../../example/SAMPLE_TEMPLATE';
import { getTemplateExecutionData } from '../__test_utils__/helpers';

const FakeApp = (props) => {
  const { executedVariables, executionResult: initialExecutionResult } = getTemplateExecutionData(SampleTemplate, {}, true);

  const [ result, setNewResult ] = useState({
    executionResult: initialExecutionResult,
    parameters: {},
    variables: executedVariables,
  });

  const onChange = (key, value, validationResult) => {
    if (validationResult && validationResult.isError) return;

    const concatParameters = { ...result.parameters, [key]: value };
    const { executedVariables, executionResult, errorMessage } = getTemplateExecutionData(SampleTemplate, concatParameters, true);

    if (errorMessage) {
      // eslint-disable-next-line no-undef
      console.error('Openlaw Execution Error:', errorMessage);
      return;
    }

    setNewResult({
      executionResult,
      parameters: concatParameters,
      variables: executedVariables,
    });
  };

  const { executionResult, parameters, variables } = result;

  return (
    <OpenLawForm
      apiClient={new APIClient('')}
      executionResult={executionResult}
      parameters={parameters}
      onChangeFunction={(key, value, validationResult) => (
        act(() => onChange(key, value, validationResult))
      )}
      openLaw={Openlaw}
      variables={variables}

      {...props}
    />
  );
};

afterEach(cleanup);

describe('Collection', () => {
  test('Can add items to a collection', () => {
    const { getAllByPlaceholderText } = render(
      <FakeApp />
    );
    const addButton = document.querySelector('.openlaw-el-collection.Favorite-Meats .openlaw-el-button');

    // add 4 new empty Collection items
    fireEvent.click(addButton);
    fireEvent.click(addButton);
    fireEvent.click(addButton);
    fireEvent.click(addButton);

    expect(getAllByPlaceholderText(/favorite meats/i).length).toBe(5);
  });

  test('Can add items to a collection via Enter key from within a field', () => {
    const { getAllByPlaceholderText, getByPlaceholderText } = render(
      <FakeApp />
    );
    const targetData = { key: 'Enter', code: 13 };
    const firstField = getByPlaceholderText(/favorite meats/i);

    fireEvent.change(firstField, {
      target: { value: 'Lamb' }
    });
    fireEvent.focus(firstField);

    // add a new field
    fireEvent.keyUp(firstField, targetData);
    // add a new field
    fireEvent.keyUp(firstField, targetData);

    expect(getAllByPlaceholderText(/favorite meats/i).length).toBe(3);
  });

  test('Can change set items in a collection', () => {
    const { getAllByPlaceholderText, getByDisplayValue } = render(
      <FakeApp />
    );
    const addButton = document.querySelector('.openlaw-el-collection.Favorite-Meats .openlaw-el-button');

    // add 4 new empty Collection items
    fireEvent.click(addButton);
    fireEvent.click(addButton);
    fireEvent.click(addButton);
    fireEvent.click(addButton);

    const fields = getAllByPlaceholderText(/favorite meats/i);

    // first
    fireEvent.change(fields[0], {
      target: { value: 'Lamb' }
    });

    // second
    fireEvent.change(fields[1], {
      target: { value: 'Little Lamb' }
    });
    
    // last
    fireEvent.change(fields[2], {
      target: { value: 'Wee Little Lamb' }
    });

    // first
    fireEvent.change(fields[0], {
      target: { value: 'Lizard' }
    });

    // second
    fireEvent.change(fields[1], {
      target: { value: 'Little Lizard' }
    });
    
    // last
    fireEvent.change(fields[2], {
      target: { value: 'Wee Little Lizard' }
    });

    getByDisplayValue(/^lizard/i);
    getByDisplayValue(/^little lizard/i);
    getByDisplayValue(/wee little lizard/i);
  });

  test('Can remove items from a collection', () => {
    const { getAllByPlaceholderText, getByDisplayValue } = render(
      <FakeApp />
    );
    const addButton = document.querySelector('.openlaw-el-collection.Favorite-Meats .openlaw-el-button');

    // add 2 new empty Collection items (total of 3)
    fireEvent.click(addButton);
    fireEvent.click(addButton);

    const fields = getAllByPlaceholderText(/favorite meats/i);

    // first
    fireEvent.change(fields[0], {
      target: { value: 'Lamb' }
    });

    // second
    fireEvent.change(fields[1], {
      target: { value: 'Little Lamb' }
    });
    
    // last
    fireEvent.change(fields[2], {
      target: { value: 'Wee Little Lamb' }
    });

    const removeButtons = document.querySelectorAll('.Favorite-Meats .openlaw-el-collection__button-remove');

    // remove 1st item
    fireEvent.click(removeButtons[0]);
    // remove 2nd item
    fireEvent.click(removeButtons[1]);

    expect(() => getByDisplayValue(/^lamb/i)).toThrow();
    expect(() => getByDisplayValue(/^little lamb/i)).toThrow();
    getByDisplayValue(/wee little lamb/i);
  });

  test('Can remove all items from a collection', () => {
    const { getAllByPlaceholderText, getByDisplayValue } = render(
      <FakeApp />
    );
    const addButton = document.querySelector('.openlaw-el-collection.Favorite-Meats .openlaw-el-button');

    // add 2 new empty Collection items (total of 3)
    fireEvent.click(addButton);
    fireEvent.click(addButton);

    const fields = getAllByPlaceholderText(/favorite meats/i);

    // first
    fireEvent.change(fields[0], {
      target: { value: 'Lamb' }
    });

    // second
    fireEvent.change(fields[1], {
      target: { value: 'Little Lamb' }
    });
    
    // last
    fireEvent.change(fields[2], {
      target: { value: 'Wee Little Lamb' }
    });

    const removeButtons = document.querySelectorAll('.Favorite-Meats .openlaw-el-collection__button-remove');

    fireEvent.click(removeButtons[0]);
    fireEvent.click(removeButtons[1]);
    fireEvent.click(removeButtons[2]);

    expect(() => getByDisplayValue(/^lamb/i)).toThrow();
    expect(() => getByDisplayValue(/^little lamb/i)).toThrow();
    expect(() => getByDisplayValue(/^wee little lamb/i)).toThrow();
  });

  test('Can validate a field within a collection', () => {
    const { getByDisplayValue, getByPlaceholderText, getByText } = render(
      <FakeApp />
    );

    fireEvent.change(getByPlaceholderText(/certifier eth address/i), {
      target: { value: '123' }
    });

    fireEvent.blur(getByDisplayValue(/123/i));

    getByText(/ethereum address: something looks incorrect/i);

    fireEvent.change(getByDisplayValue(/123/i), {
      target: { value: '0xc0ffee254729296a45a3885639AC7E10F9d54979' }
    });

    fireEvent.blur(getByDisplayValue(/0xc0ffee254729296a45a3885639AC7E10F9d54979/i));

    expect(() => getByText(/ethereum address: something looks incorrect/i)).toThrow();
  });

  test('Can render a Structure variable within a collection', () => {
    const { getByDisplayValue, getByPlaceholderText } = render(
      <FakeApp />
    );
    const certificationDate = document.querySelector('input.Certification-Date');
    getByPlaceholderText(/certification title/i);
    expect(certificationDate).not.toBeNull();
    getByPlaceholderText(/certifier eth address/i);

    fireEvent.change(getByPlaceholderText(/certification title/i), {
      target: { value: 'Master of BBQ' }
    });
    fireEvent.change(certificationDate, {
      target: { value: '-649062000000' } /* June 8, 1949 */
    });
    fireEvent.change(getByPlaceholderText(/certifier eth address/i), {
      target: { value: '0xc0ffee254729296a45a3885639AC7E10F9d54979' }
    });

    getByDisplayValue(/master of bbq/i);
    getByDisplayValue(/-649062000000/i);
    getByDisplayValue(/0xc0ffee254729296a45a3885639AC7E10F9d54979/i);
  });

  test('Can disable Collection add button if inputProps.Collection contains "disabled"', () => {
    const { getAllByPlaceholderText } = render(
      <FakeApp
        inputProps={{
          Collection: {
            disabled: true,
          },
        }}
      />
    );

    const addButton = document.querySelector('.openlaw-el-collection.Favorite-Meats .openlaw-el-button');

    expect(addButton.disabled).toBe(true);

    // attempt to add a new empty Collection item
    fireEvent.click(addButton);

    expect(getAllByPlaceholderText(/favorite meats/i).length).toBe(1);
  });

  test('Can disable Collection add button if inputProps["*"] contains "disabled"', () => {
    const { getAllByPlaceholderText } = render(
      <FakeApp
        inputProps={{
          '*': {
            disabled: true,
          },
        }}
      />
    );

    const addButton = document.querySelector('.openlaw-el-collection.Favorite-Meats .openlaw-el-button');

    expect(addButton.disabled).toBe(true);

    // attempt to add a new empty Collection item
    fireEvent.click(addButton);

    expect(getAllByPlaceholderText(/favorite meats/i).length).toBe(1);
  });

  test('Can disable Collection remove button if inputProps.Collection contains "disabled"', () => {
    const { getAllByPlaceholderText } = render(
      <FakeApp
        inputProps={{
          Collection: {
            disabled: true,
          },
        }}
      />
    );

    const removeButton = document.querySelector('.Favorite-Meats .openlaw-el-collection__button-remove');

    expect(removeButton.disabled).toBe(true);

    // attempt to add a new empty Collection item
    fireEvent.click(removeButton);

    expect(getAllByPlaceholderText(/favorite meats/i).length).toBe(1);
  });

  test('Can disable Collection remove button if inputProps["*"] contains "disabled"', () => {
    const { getAllByPlaceholderText } = render(
      <FakeApp
        inputProps={{
          '*': {
            disabled: true,
          },
        }}
      />
    );

    const removeButton = document.querySelector('.Favorite-Meats .openlaw-el-collection__button-remove');

    expect(removeButton.disabled).toBe(true);

    // attempt to add a new empty Collection item
    fireEvent.click(removeButton);

    expect(getAllByPlaceholderText(/favorite meats/i).length).toBe(1);
  });
});
