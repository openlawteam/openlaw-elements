// @flow

import * as React from 'react';

import ShowHide from './ShowHide';

type Props = {
  children: () => React.Node,
  index: number,
  mySuperCustomKey: string,
  section: string,
};

const { Fragment } = React;

const SectionsRenderer = (props: Props) => {
  const { children, ...sectionData } = props;
  const { section, mySuperCustomKey, index } = sectionData;

  return (
    Object.keys(sectionData).length && section
      // the section has a title
      ? (
        <ShowHide
          key={`section-${section}`}
          show={index === 0}
          renderTrigger={() => (
            <h2 className="sectionTrigger" tabIndex="0">
              {`${mySuperCustomKey || ''}${section}`}
            </h2>
          )}>
          {children()}
        </ShowHide>

      // section exists but no title, e.g. unsectionedTitle
      ) : (
        <Fragment key={`section-${section}`}>
          <hr />
          <h3 className="unsectionedTitle">Date & Signature</h3>
          {children()}
        </Fragment>
      )
  );
};

export default SectionsRenderer;
