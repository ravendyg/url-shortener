'use strict';

import * as React from 'react';
import { render } from 'react-dom';

import {subscribeToUrl, sendUrl} from './logic';

import { Spinner } from './components/spinner';

class App extends React.Component {

  constructor() {
    super();

    this.state = {
      disableCreate: true,
      disableCopy: true,
      disableInput: false,
      waiting: false,
      error: null
    };
  }

  componentDidMount() {
    this.unsubscribe = subscribeToUrl(this.handleResponse.bind(this));
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  sendUrl() {
    sendUrl(this.input.value);
    this.setState({
      disableCreate: true,
      disableCopy: true,
      disableInput: true,
      waiting: true
    });
  }

  handleResponse(error, url) {
    if (error) {
      this.setState({
        waiting: false,
        disableInput: false,
        error
      });
    } else {
      this.input.value = url;
      this.setState({
        waiting: false,
        disableInput: false,
        disableCopy: false,
      });
    }
  }

  copy() {
    console.log('copy');
  }

  _onChange(input)  {
    this.setState({
      disableCopy: true,
      disableCreate: input.target.value.length === 0
        ? true : false,
      error: null
    });
  }

  render() {
    return(
      <div>
        <div>
          <input
            className="url-input"
            type="text"
            placeholder="URL goes here"
            disabled={this.state.disableInput}
            onChange={this._onChange.bind(this)}
            ref={e => this.input = e}
          />
        </div>
        <div className="btn-holder">
          <button
            id="create-url"
            disabled={this.state.disableCreate}
            onClick={this.sendUrl.bind(this)}
          >Create URL</button>
          <button
            id="copy-url"
            disabled={this.state.disableCopy}
            onClick={this.copy.bind(this)}
          >Copy URL</button>
        </div>
        {this.state.waiting ? <Spinner /> : null}
        {this.state.error ? <div className="error-msg">{this.state.error}</div> : null}
      </div>
    );
  }
}

render(
  <App />,
  document.getElementById(`app`)
);