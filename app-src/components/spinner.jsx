'use strict';

import * as React from 'react';
import { render } from 'react-dom';

export class Spinner extends React.Component {

  render() {
    return(
      <div className="spinner">
        <img src="/static/spinner.gif" />
      </div>
    );
  }
}
