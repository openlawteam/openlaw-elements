// @flow

import * as React from 'react';

import { CSS_CLASS_NAMES } from './constants';
import { singleSpaceString } from './utils';
import type { FieldPropsValueType, OnChangeFuncType } from './flowTypes';

type Props = {
  cleanName: string,
  description: string,
  inputProps: ?FieldPropsValueType,
  name: string,
  onChange: OnChangeFuncType,
  savedValue: string,
  textLikeInputClass: string,
};

type State = {
  currentValue: string,
};

export class LargeText extends React.PureComponent<Props, State> {
  state = {
    currentValue: this.props.savedValue || '',
  };

  constructor(props: Props) {
    super(props);

    const self: any = this;
    self.onChange = this.onChange.bind(this);
  }

  onChange(event: SyntheticEvent<*>) {
    const eventValue = event.currentTarget.value;
    const { name, onChange } = this.props;

    this.setState({
      currentValue: eventValue,
    }, () => {
      onChange(name, eventValue || undefined);
    });
  }

  render() {
    const { cleanName, description, inputProps, textLikeInputClass } = this.props;
    const inputPropsClassName = (inputProps && inputProps.className) ? `${inputProps.className}` : '';

    return (
      <div className="contract-variable">
        <label>
          <span>{description}</span>

          <textarea
            placeholder={description}
            title={description}

            {...inputProps}

            className={singleSpaceString(
              `${CSS_CLASS_NAMES.fieldTextarea} ${textLikeInputClass} ${cleanName} ${inputPropsClassName}`
            )}
            onChange={this.onChange}
            value={this.state.currentValue}
          />
        </label>
      </div>
    );
  }
}
