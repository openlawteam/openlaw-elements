// @flow

import * as React from 'react';
import Autosuggest from 'react-autosuggest';

import { FieldError } from './FieldError';
import { CSS_CLASS_NAMES } from './constants';
import type {
  FieldEnumType,
  FieldErrorType,
  FieldPropsValueType,
  ObjectAnyType,
  OnChangeFuncType,
  OnValidateFuncType,
  ValidateOnKeyUpFuncType,
} from './flowTypes';

type Props = {
  apiClient: Object, // opt-out of type checker until we export APIClient flow types
  cleanName: string,
  description: string,
  inputProps: ?FieldPropsValueType,
  name: string,
  onChange: OnChangeFuncType,
  onKeyUp?: ValidateOnKeyUpFuncType,
  onValidate: ?OnValidateFuncType,
  openLaw: Object, // opt-out of type checker
  savedValue: string,
  textLikeInputClass: string,
  variableType: FieldEnumType,
};

type State = {
  currentValue: string,
  errorMessage: string,
  shouldShowError: boolean,
  suggestions: Array<Object>,
};

const PROGRESS_ITEM_TEXT = '\u2026'; /* ... */

const getSectionSuggestions = (section) => section.suggestions;
const getSuggestionValue = ({ address }: { address: string }) => address;
const renderSectionTitle = ({ title }) => title;
const renderSuggestion = ({ address }: { address: string }) => address;
const renderSuggestionsContainer = (data) => {
  const { children, containerProps } = data;

  const childrenMapped = React.Children.map(children, child => {
    try {    
      // eslint-disable-next-line no-unused-vars
      const [ _, fakeAddress ] = child.props.children;
      const { props:fakeAddressProps } = fakeAddress;
      const { items } = fakeAddressProps;
      
      // Don't render the default "address" item (hacky) that comes with the progress indicator,
      // We need a cleaner way to have a basic in-drop-down progress indicator, but it's not so easy.
      if (items && items[0].address === PROGRESS_ITEM_TEXT) {
        return React.cloneElement(child.props.children[0], {
          style: {
            display: 'none',
          }
        });
      }

      return child;
    } catch (error) {
      return child;
    }
  });

  return (
    <div {...containerProps}>
      {childrenMapped}
    </div>
  );
};

export class Address extends React.PureComponent<Props, State> {
  baseErrorData = {
    elementName: this.props.cleanName,
    elementType: this.props.variableType,
    errorMessage: '',
    isError: false,
    value: (this.props.savedValue || ''),
  };

  isCreatingAddress = false;
  isDataValid = false;

  ref: {current: null | HTMLDivElement} = React.createRef();

  state = {
    currentValue: this.props.savedValue,
    errorMessage: '',
    suggestions: [],
    shouldShowError: false,
  };

  constructor(props: Props) {
    super(props);

    const self: any = this;
    self.blurInput = this.blurInput.bind(this);
    self.callOnValidateAndGetErrorMessage = this.callOnValidateAndGetErrorMessage.bind(this);
    self.createOpenLawAddress = this.createOpenLawAddress.bind(this);
    self.onBlur = this.onBlur.bind(this);
    self.onChange = this.onChange.bind(this);
    self.onKeyUp = this.onKeyUp.bind(this);
    self.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    self.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    self.onSuggestionSelected = this.onSuggestionSelected.bind(this);
  }

  blurInput() {
    const { cleanName } = this.props;
    const inputElement = this.ref.current && this.ref.current.querySelector(`input.${cleanName}`);

    if (inputElement) inputElement.blur();
  }

  createOpenLawAddress(addressData: ObjectAnyType): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const openlawAddress = this.props.openLaw.createAddress(addressData);

        resolve({
          addressData,
          openlawAddress,
        });
      } catch (error) {
        reject();
      }
    });
  }

  onBlur(event: SyntheticFocusEvent<HTMLInputElement>, selectedItem: ObjectAnyType) {
    const { highlightedSuggestion } = selectedItem;

    // handle validation when user focuses away
    if (!highlightedSuggestion) {
      const { inputProps } = this.props;
      const { currentValue, errorMessage } = this.state;
      const updatedErrorMessage = errorMessage
        ? errorMessage
        : (currentValue && this.isDataValid === false)
        ? 'Please choose a valid address from the options.'
        : '';

      const errorMessageToSet = this.callOnValidateAndGetErrorMessage({
        ...this.baseErrorData,

        errorMessage: updatedErrorMessage,
        eventType: 'blur',
        isError: updatedErrorMessage.length > 0,
        value: currentValue,
      });

      // persist event outside of this handler to a parent component
      if (event) event.persist();

      this.setState(() => {
        return {
          errorMessage: errorMessageToSet,
          shouldShowError: errorMessageToSet.length > 0,
        };
      }, () => {
        if (event && inputProps && inputProps.onBlur) {
          inputProps.onBlur(event);
        }
      });
    }   
  }

  // Set current value of autosuggest box (onChange method required)
  onChange(event: SyntheticInputEvent<HTMLInputElement>, autosuggestEvent: ObjectAnyType) {
    const { newValue } = autosuggestEvent;
    const { inputProps } = this.props;
    const errorMessage = this.callOnValidateAndGetErrorMessage({
      ...this.baseErrorData,

      eventType: 'change',
      value: newValue,
    });

    const errorMessageToSet = errorMessage
      ? { errorMessage } : null;
    const shouldShowError = errorMessage.length > 0
      ? { shouldShowError: true } : null;

    // persist event outside of this handler to a parent component
    if (event) event.persist();

    this.setState({
      currentValue: newValue,

      ...errorMessageToSet,
      ...shouldShowError,
    }, () => {
      // flag dirty input, as we haven't fetched anything and validated with OpenLaw
      this.isDataValid = false;

      if (event && inputProps && inputProps.onChange) {
        inputProps.onChange(event);
      }
    });
  }

  onKeyUp(event: SyntheticKeyboardEvent<HTMLInputElement>) {
    if (this.props.onKeyUp) {
      this.props.onKeyUp(event, this.isDataValid);
    }

    if (this.props.inputProps && this.props.inputProps.onKeyUp) {
      this.props.inputProps.onKeyUp(event);
    }
  }

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested() {
    this.setState({
      suggestions: [],
    });
  }

  // Autosuggest will call this function every time you need to update suggestions.
  async onSuggestionsFetchRequested({ value }: { value: string }) {
    const valueTrimmed = value.trim();
    const isInputLongEnough = valueTrimmed && valueTrimmed.length > 2;

    if (!isInputLongEnough) return;

    // set our contrived loading text (sectionTitle);
    // wish there were a cleaner, easier way to do this
    this.setState({
      suggestions: [{
        title: 'Searching addresses\u2026',
        suggestions: [{
          address: PROGRESS_ITEM_TEXT,
        }],
      }],
    });
    
    try {
      const suggestions = await this.props.apiClient.searchAddress(value);

      // don't try to set & show more suggestions while creating an address
      if (this.isCreatingAddress) return;

      this.setState({
        suggestions: [{
          suggestions,
        }],
      });
    } catch (error) {
      const errorMessageToSet = this.callOnValidateAndGetErrorMessage({
        ...this.baseErrorData,

        errorMessage: 'Something went wrong while searching for an address.',
        eventType: 'change',
        isError: true,
        value,
      });

      this.setState({
        errorMessage: errorMessageToSet,
        shouldShowError: errorMessageToSet.length > 0,
        suggestions: [{
          suggestions: [],
        }],
      });
    }
  }

  // Will be called every time suggestion is selected via mouse or keyboard,
  // and blur the input.
  async onSuggestionSelected(event: SyntheticInputEvent<HTMLInputElement>, autosuggestEvent: ObjectAnyType) {
    const { method } = autosuggestEvent;

    // cause the element to lose focus on 'enter'
    // this is already handled for click via `focusInputOnSuggestionClick={false}`
    if (method === 'enter' || method === 'click') {
      setTimeout(() => this.blurInput());

      const { suggestion } = autosuggestEvent;
      const { apiClient, inputProps, name, onChange } = this.props;
      
      if (suggestion) {
        try {
          this.isCreatingAddress = true;

          // persist event outside of this handler to a parent component
          if (event) event.persist();

          const addressDetails = await apiClient.getAddressDetails(suggestion.placeId);
          const { addressData, openlawAddress } = await this.createOpenLawAddress(addressDetails);

          const errorMessageToSet = this.callOnValidateAndGetErrorMessage({
            ...this.baseErrorData,

            eventType: 'blur',
            value: addressData.address,
          });

          this.setState({
            currentValue: addressData.address,
            errorMessage: errorMessageToSet,
          }, () => {
            this.isDataValid = true;
            this.isCreatingAddress = false;

            onChange(name, openlawAddress);

            if (event && inputProps && inputProps.onChange) {
              inputProps.onChange(event);
            }
          });
        } catch (error) {
          const errorMessageToSet = this.callOnValidateAndGetErrorMessage({
            ...this.baseErrorData,

            errorMessage: 'Something went wrong while creating an address.',
            eventType: 'blur',
            isError: true,
            value: '',
          });

          this.setState({
            currentValue: '',
            errorMessage: errorMessageToSet,
          }, () => {
            this.isDataValid = false;
          });
        }
      }
    }
  }

  callOnValidateAndGetErrorMessage(validationData: FieldErrorType): string {
    const { onValidate } = this.props;
    const userReturnedValidationData = onValidate && onValidate(validationData);
    const { errorMessage } = userReturnedValidationData || {};
    
    return errorMessage || validationData.errorMessage;
  }

  render() {
    const { description, cleanName, inputProps, textLikeInputClass, variableType } = this.props;
    const { currentValue, errorMessage, shouldShowError, suggestions } = this.state;
    const errorClassName = (errorMessage && shouldShowError) ? CSS_CLASS_NAMES.fieldInputError : '';
    const inputPropsClassName = (inputProps && inputProps.className) ? ` ${inputProps.className}` : '';

    const autoSuggestInputProps = {
      placeholder: description,
      title: description,

      ...inputProps,

      onBlur: this.onBlur,
      className: `${CSS_CLASS_NAMES.fieldInput} ${textLikeInputClass} ${cleanName} ${inputPropsClassName} ${errorClassName}`,
      onChange: this.onChange,
      onKeyUp: this.onKeyUp,
      type: 'text',
      value: currentValue,
    };

    return (
      <div ref={this.ref} className={`${CSS_CLASS_NAMES.field} ${CSS_CLASS_NAMES.fieldTypeToLower(variableType)}`}>
        <label className={`${CSS_CLASS_NAMES.fieldLabel}`}>
          <span className={`${CSS_CLASS_NAMES.fieldLabelText}`}>{description}</span>

          <Autosuggest
            getSectionSuggestions={getSectionSuggestions}
            getSuggestionValue={getSuggestionValue}
            inputProps={autoSuggestInputProps}
            multiSection
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            onSuggestionSelected={this.onSuggestionSelected}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            renderSectionTitle={renderSectionTitle}
            renderSuggestion={renderSuggestion}
            renderSuggestionsContainer={renderSuggestionsContainer}
            suggestions={suggestions}
          />

          <FieldError
            cleanName={cleanName}
            errorMessage={errorMessage}
            shouldShowError={shouldShowError}
          />
        </label>
      </div>
    );
  }
}
