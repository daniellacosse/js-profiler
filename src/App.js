import React, { Component } from 'react';
import { Table, Collapse } from 'reactstrap';

import './App.css';
import 'codemirror/lib/codemirror.css';
import 'bootstrap/dist/css/bootstrap.css';

import { loadFunctions, profileFunc, analyzeResults } from './lib';
import { StatsCard, CodeTabs } from './components';

class App extends Component {
  state = {
    isRunning: false,
    isTableOpen: false,
    code: "// Paste JS function here",
    options: {
      lineNumbers: true,
      mode: "javascript",
      theme: "night"
    },
    activeTab: '1',
    tabs: [{id: '1', code:''}, {id: '2', code:''}]
  }

  onCodeChangeFactory(tabId) {
    return (code) => {
      const tabIndex = parseInt(tabId, 10) - 1;
      const { tabs } = this.state;

      tabs[tabIndex].code = code;
      this.setState({ tabs });
    }
  }

  onTableToggle() {
    this.setState({
      isTableOpen: !this.state.isTableOpen
    });
  }

  onTabToggle(tab) {
    if (this.state.activeTab !== tab)
      this.setState({
        activeTab: tab
      });
  }

  addNewTab() {
    const { tabs } = this.state;

    const lastTab = tabs[tabs.length - 1]
    const newTabId = String(parseInt(lastTab.id, 10) + 1)
    const newTabs = tabs.push({ id: newTabId, code: '' });

    this.setState({
      tabs: newTabs,
      activeTab: newTabId
    })
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

  renderResultCards() {
    return this.state.results.map((result, i) =>
      <StatsCard
        results={result}
        name={`V${i}`}
        {...analyzeResults(result)}
      />
    )
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
    const {results, isTableOpen} = this.state;

    if (!this.state.results) {
      return <section></section>;
    }

    return (
      <section>
        {this.renderResultCards()}

        <button onClick={this.onToggleTable.bind(this)}>
          Toggle Table
        </button>

        <Collapse isOpen={isTableOpen}>
          <Table>
            <thead>
              <tr>
                {results.map((row, i) => <th key={i}>{i}</th>)}
              </tr>
            </thead>
            <tbody>
              {results[0].map((cell, i) => this.renderResultRow(i))}
            </tbody>
          </Table>
        </Collapse>
      </section>
    );
  }

  render() {
    const {isRunning, tabs, activeTab} = this.state;

    return (
      <main>
        <CodeTabs {...{ tabs, activeTab }}
          onToggle={this.onTabToggle.bind(this)}
          onChange={this.onCodeChangeFactory.bind(this)}
          addNewTab={this.addNewTab.bind(this)}
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
