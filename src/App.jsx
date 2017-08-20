import React, { Component } from "react";
import { Collapse, Button } from "reactstrap";

import { transpose, loadFunctions, profileFunc, analyzeResults } from "./lib";
import { StatsCard, CodeTabs, RawDataTable } from "./components";

import "codemirror/mode/javascript/javascript";

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

    const newTabs = [ ...tabs,
      {
        id: newTabId,
        code: "() => {}"
      }
    ]

    this.setState({
      tabs: newTabs,
      activeTab: newTabId
    });
  }

  runCode = () => {
    this.setState({ isRunning: true }, async () => {
      const funcs = this.state.tabs.map(({ code }) => code);
      await loadFunctions(funcs);

      let _len = funcs.length
      let results = new Array(funcs.length);

      while (_len--) {
        const newResult = await profileFunc(window[`_func${_len}`]);

        results[_len] = newResult;
      }

      return this.setState({
        isRunning: false,
        results
      });
    });
  }

  render() {
    const { isRunning, tabs, activeTab, options } = this.state;
    return (
      <main>
        <section>
          <CodeTabs {...{ tabs, activeTab, options }}
            addNewTab={this.addNewTab}
            onToggleFactory={this.onTabToggleFactory}
            onChangeFactory={this.onCodeChangeFactory}
            />

          <Button className="RunButton" color="primary" onClick={this.runCode} disabled={isRunning}>
            Run
          </Button>
        </section>

        {this.renderResults()}
      </main>
    );
  }

  renderResults() {
    const { results, isTableOpen } = this.state;

    return results && (
      <section>
        {this.renderResultCards()}

        <Button color="link" block onClick={this.onTableToggle}>
          Raw Data {isTableOpen ? "▲" : "▼"}
        </Button>

        <Collapse isOpen={isTableOpen}>
          <RawDataTable data={transpose(results)} />
        </Collapse>
      </section>
    );
  }

  renderResultCards() {
    return (
      <section  style={{ display: "flex", flexWrap: "wrap" }}>
        {this.state.results.map((result, i) =>
          <StatsCard key={i} name={`Function ${i + 1}`}
            results={result}
            {...analyzeResults(result)}
          />
        )}
      </section>
    )
  }
}
