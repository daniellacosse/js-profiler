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

  render() {
    return (
      <div id="code-area">
        <Nav tabs>
          {this.state.tabs.map((tabId, i) => {
            return <CodeTabNav 
              key={i}
              title={`Function ${tabId}`}
              active={this.state.activeTab === tabId}
              onClick={() => {this.toggle(tabId)}}>
            </CodeTabNav>
          })}
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          {this.state.tabs.map((tabId, i) => <CodeTabPane key={i} id={tabId}></CodeTabPane>)}
        </TabContent>
      </div>
    );
  }
}