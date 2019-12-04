// @flow

import * as React from 'react';

import { CSS_CLASS_NAMES as css } from './constants';
import type { FieldExtraTextType } from './flowTypes';

type Props = {
  text: ?FieldExtraTextType
};

export default function ExtraText(props: Props): React.Node {  
  const { text } = props;

  if (!text) return null;

  return typeof text === 'function'
    ? <div className={css.fieldExtraText}>{text()}</div>
    : <div className={css.fieldExtraText}><span>{text}</span></div>;
}
