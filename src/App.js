import React, { Component } from 'react';
import './App.css';

import 'codemirror/lib/codemirror.css';
import 'bootstrap/dist/css/bootstrap.css';

import CodeTabs from './code-tabs';

import loadFunctions from './insert-js-fragment';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isRunning: false,
      code: "// Paste JS function here",
      options: {
        lineNumbers: true,
        mode: "javascript",
        theme: "night"
      }
    };
  }

  updateCode(newCode) {
      this.setState({
          code: newCode,
      });
  }

  runCode() {
    this.setState({
      isRunning: true
    });
  }

  renderJSFragments() {
    if (!this.state.isRunning) return;

    loadFunctions([ this.state.code ])
      .then(() => window._func0());
  }

  render() {
    const {code, options} = this.state;

    return (
      <main>
        {this.renderJSFragments()}

        <CodeTabs/>

        <button onClick={this.runCode.bind(this)}>
          Run Code
        </button>
      </main>
    );
  }
}

export default App;
