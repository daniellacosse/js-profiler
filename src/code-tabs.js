import React from 'react';
import { TabContent, Nav } from 'reactstrap';
import CodeTabNav from './code-tabs-nav';
import CodeTabPane from './code-tab-pane';

export default class CodeTabs extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1',
      tabs: ['1', '2']
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  addNewTab() {
    let lastTab = parseInt(this.state.tabs[this.state.tabs.length - 1], 10);
    let newTab = String(lastTab + 1)
    let newTabs = this.state.tabs.concat([newTab]);
    this.setState({
      tabs: newTabs,
      activeTab: newTab
    })
  }

  render() {
    return (
      <div id="code-area">
        <Nav tabs>
          {this.state.tabs.map((tabId, i) => {
            return <CodeTabNav 
              key={i}
              title={`Function ${tabId}`}
              active={this.state.activeTab === tabId}
              onClick={() => this.toggle(tabId)}>
            </CodeTabNav>
          })}
          <CodeTabNav 
            title="+"
            active={false}
            onClick={() => this.addNewTab()}
          >
          </CodeTabNav>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          {this.state.tabs.map((tabId, i) => <CodeTabPane key={i} id={tabId}></CodeTabPane>)}
        </TabContent>
      </div>
    );
  }
}