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
      tabs: [{id: '1', code:''}, {id: '2', code:''}]
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
    let lastTab = this.state.tabs[this.state.tabs.length - 1]
    let newTabId = String(parseInt(lastTab.id, 10) + 1)
    let newTabs = this.state.tabs.concat([{id: newTabId, code: ''}]);
    this.setState({
      tabs: newTabs,
      activeTab: newTabId
    })
  }

  render() {
    return (
      <div id="code-area">
        <Nav tabs>
          {this.state.tabs.map(({id}, i) => {
            return <CodeTabNav 
              key={i}
              title={`Function ${id}`}
              active={this.state.activeTab === id}
              onClick={() => this.toggle(id)}>
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
          {this.state.tabs.map(({id}, i) => <CodeTabPane key={i} id={id}></CodeTabPane>)}
        </TabContent>
      </div>
    );
  }
}