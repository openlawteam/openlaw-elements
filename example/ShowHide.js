// @flow

import * as React from 'react';

type Props = {
  children: React.Node,
  renderTrigger: () => React.Node,
  show: boolean,
};

const { Fragment, useState } = React;

const ShowHide = (props: Props) => {
  const [ show, setShouldShow ] = useState(props.show);

  return (
    <Fragment>
      <div
        onClick={() => setShouldShow(!show)}
        onKeyUp={event => {
          event.key === 'Enter' && setShouldShow(!show);
        }}>
        {props.renderTrigger()}
      </div>
      
      {show ? props.children : null}
    </Fragment>
  );
};

export default ShowHide;
