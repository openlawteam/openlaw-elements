import React, { Fragment, useState } from 'react';
import { Openlaw } from 'openlaw';

import Form from './Form';
import SampleTemplateText from './SAMPLE_TEMPLATE';

/**
 * Example app showing how you can render `OpenLawForm`
 * with a valid OpenLaw template.
 */

const renderPreviewHTML = (formState, callback) => () => {
  const { executionResult } = formState;
  const { agreement } = Openlaw.getAgreements(executionResult)[0];

  callback(Openlaw.renderForPreview(agreement, {}, {}));
};

const App = () => {
  const [formState, liftFormState] = useState();
  const [previewHTML, setPreviewHTML] = useState();
  const [view, toggleView] = useState('source');

  return (
    <Fragment>
      {/* BUTTONS */}
      <div className="buttonsWrap">
        <button
          onClick={() => {
            toggleView('preview');
            return renderPreviewHTML(formState, setPreviewHTML)();
          }}
          className="button">
          Run preview
        </button>

        {previewHTML && (
          <button
            onClick={() => toggleView(view === 'preview' ? 'source' : 'preview')}
            className="button"
            type="button">
            Switch <span className={view === 'preview' ? 'previewEye' : null}>👀</span>
          </button>
        )}
      </div>

      <div className="wrapApp">
        <div className="paneLeft">
          <Form stateLifter={liftFormState} />
        </div>

        <div className="paneRight">
          {(previewHTML && view === 'preview')
            ? (
              <div
                dangerouslySetInnerHTML={{ __html: previewHTML }}
              />
            ) : <pre className="pre">{SampleTemplateText}</pre>
          }
        </div>
      </div>
    </Fragment>
  );
};

export default App;
