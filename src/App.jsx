import React, { Component } from "react";
import { Collapse, Button } from "reactstrap";

import { transpose, loadFunctions, profileFunc, analyzeResults } from "./lib";
import { StatsCard, CodeTabs, RawDataTable } from "./components";

import "codemirror/mode/javascript/javascript";

export default class App extends Component {
  state = require("./App.defaultState.json")

  onCodeChangeFactory = (tabId) => {
    let newTabs = this.state.tabs.slice();
    return (code) => {
      newTabs.forEach(tab => {
        if (tab.id === tabId) {
          tab.code = code;
        }
      });

      this.setState({ tabs: newTabs });
    }
  }

  onTabToggleFactory = (tabId) => {
    return () => {
      this.setState({
        activeTab: tabId
      });
    }
  }

  onTabCloseFactory = (tabId) => {
    return (event) => {
      event.stopPropagation();
      let newTabs = this.state.tabs.filter(tab => tab.id !== tabId);
      let newActiveTabId = null;

      // select the active tab
      if (this.state.activeTab === tabId) {
        // active tab closed. search for an adjecent tab to make active
        this.state.tabs.forEach((tab, index) => {
          if (tab.id === tabId) {
            if (index === 0) {
              newActiveTabId = this.state.tabs[1].id;
            } else {
              newActiveTabId = this.state.tabs[index - 1].id;
            }
          }
        });
      } else {
        // search for the location of the current active tab in the newTabs list
        newActiveTabId = this.state.activeTab;
      }

      this.setState({
        tabs: newTabs,
        activeTab: newActiveTabId
      });
    };
  }

  onTableToggle = () => {
    this.setState({
      isTableOpen: !this.state.isTableOpen
    });
  }

  addNewTab = () => {
    const { tabs } = this.state;
    const lastTab = tabs[tabs.length - 1];
    const newTabId = parseInt(lastTab.id, 10) + 1;

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
        <section>
          <CodeTabs {...{ tabs, activeTab, options }}
            addNewTab={this.addNewTab}
            onToggleFactory={this.onTabToggleFactory}
            onChangeFactory={this.onCodeChangeFactory}
            onTabCloseFactory={this.onTabCloseFactory}
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
