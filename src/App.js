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
      },
      activeTab: '1',
      tabs: [{id: '1', code:''}, {id: '2', code:''}]
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

  addNewTab() {
    let lastTab = this.state.tabs[this.state.tabs.length - 1]
    let newTabId = String(parseInt(lastTab.id, 10) + 1)
    let newTabs = this.state.tabs.concat([{id: newTabId, code: ''}]);

    this.setState({
      tabs: newTabs,
      activeTab: newTabId
    })
  }


  onChangeHandler(tabId) {
    return (code) => {
      let tabIndex = parseInt(tabId, 10) - 1; 
      let tabs = this.state.tabs;
      tabs[tabIndex].code = code;
      this.setState({tabs: tabs});
      console.log(this.state.tabs);
    } 
  }


  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
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
        <CodeTabs 
          tabs={this.state.tabs}
          activeTab={this.state.activeTab} 
          toggle={this.toggle.bind(this)}
          addNewTab={this.addNewTab.bind(this)}
          onChange={this.onChangeHandler.bind(this)}
        />

        <button onClick={this.runCode.bind(this)} disabled={isRunning}>
          Run Code
        </button>

        {this.renderResults()}
      </main>
    );
  }
}

export default App;
