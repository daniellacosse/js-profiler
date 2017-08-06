import React, { Component } from 'react';
import './App.css';

import { Table } from 'reactstrap';
import 'codemirror/lib/codemirror.css';
import 'bootstrap/dist/css/bootstrap.css';

import CodeTabs from './code-tabs';

import loadFunctions from './insert-js-fragment';
import profileFunc from './profile-func';

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
    this.setState({ isRunning: true }, async () => {
      const funcs = [ this.state.code ];

      await loadFunctions(funcs);

      const results = funcs.map(
        async (_, index) => await profileFunc(window[`_func${index}`])
      );

      Promise
        .all(results)
        .then((unwrappedResults) => this.setState({
          isRunning: false,
          results: unwrappedResults
        }));
    });
  }

  renderResultRow(index) {
    let rows = [];
    let _countdown = this.state.results.length;

    while(_countdown--) {
      rows.push(this.state.results[_countdown][index]);
    }

    return (
      <tr key={index}>
        {rows.map((cell, i) => <td key={i}>{cell}ms</td>)}
      </tr>
    );
  }

  renderResults() {
    if (!this.state.results) {
      return <Table></Table>;
    }

    return (
      <Table>
        <thead>
          <tr>
            {this.state.results.map((row, i) => <th key={i}>{i}</th>)}
          </tr>
        </thead>
        <tbody>
          {this.state.results[0].map((cell, i) => this.renderResultRow(i))}
        </tbody>
      </Table>
    );
  }

  render() {
    const {code, options, isRunning} = this.state;

    return (
      <main>
        <CodeTabs/>

        <button onClick={this.runCode.bind(this)} disabled={isRunning}>
          Run Code
        </button>

        {this.renderResults()}
      </main>
    );
  }
}

export default App;
