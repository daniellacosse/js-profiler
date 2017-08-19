import React, { Component } from "react";
import { Collapse } from "reactstrap";

import { transpose, loadFunctions, profileFunc, analyzeResults } from "./lib";
import { StatsCard, CodeTabs, RawDataTable } from "./components";

export default class App extends Component {
  state = require("./App.defaultState.json")

  onCodeChangeFactory = (tabId) => {
    return (code) => {
      const tabIndex = parseInt(tabId, 10) - 1;
      const { tabs } = this.state;

      tabs[tabIndex].code = code;

      this.setState({ tabs });
    }
  }

  onTabToggleFactory = (tabId) => {
    return () =>
      this.setState({
        activeTab: (this.state.activeTab !== tabId) && tabId
      });
  }

  onTableToggle = () => {
    this.setState({
      isTableOpen: !this.state.isTableOpen
    });
  }

  addNewTab = () => {
    const { tabs } = this.state;

    const lastTab = tabs[tabs.length - 1];

    const newTabId = String(
      parseInt(lastTab.id, 10) + 1
    );

    const newTabs = tabs.push({
      id: newTabId,
      code: ""
    });

    this.setState({
      tabs: newTabs,
      activeTab: newTabId
    });
  }

  runCode = () => {
    this.setState({ isRunning: true }, async() => {
      const funcs = this.state.tabs.map(({ code }) => code);
      await loadFunctions(funcs);

      const results = funcs.map(
        async(_, index) => await profileFunc(window[`_func${index}`])
      );

      Promise
        .all(results)
        .then((unwrappedResults) => this.setState({
          isRunning: false,
          results: unwrappedResults
        }));
    });
  }

  render() {
    const { isRunning, tabs, activeTab, options } = this.state;

    return (
      <main>
        <CodeTabs {...{ tabs, activeTab, options }}
          addNewTab={this.addNewTab}
          onToggleFactory={this.onTabToggleFactory}
          onChangeFactory={this.onCodeChangeFactory}
        />

        <button onClick={this.runCode} disabled={isRunning}>
          Run Code
        </button>

        {this.renderResults()}
      </main>
    );
  }

  renderResults() {
    const { results, isTableOpen } = this.state;

    return results && (
      <section>
        {this.renderResultCards()}

        <button onClick={this.onToggleTable}>
          Toggle Table
        </button>

        <Collapse isOpen={isTableOpen}>
          <RawDataTable data={transpose(results)} />
        </Collapse>
      </section>
    );
  }

  renderResultCards() {
    return this.state.results.map((result, i) =>
      <StatsCard
        results={result}
        name={`V${i}`}
        key={i}
        {...analyzeResults(result)}
      />
    );
  }
}
