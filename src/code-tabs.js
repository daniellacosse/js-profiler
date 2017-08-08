import React from 'react';
import { TabContent, Nav } from 'reactstrap';
import CodeTabNav from './code-tabs-nav';
import CodeTabPane from './code-tab-pane';

export default class CodeTabs extends React.Component {

  render() {
    return (
      <div id="code-area">
        <Nav tabs>
          {this.props.tabs.map(({id}, i) => {
            return <CodeTabNav 
              key={i}
              title={`Function ${id}`}
              active={this.props.activeTab === id}
              onClick={() => this.props.toggle(id)}>
            </CodeTabNav>
          })}
          <CodeTabNav 
            title="+"
            active={false}
            onClick={this.props.addNewTab}
          >
          </CodeTabNav>
        </Nav>
        <TabContent activeTab={this.props.activeTab}>
          {this.props.tabs.map(({id}, i) => {
            return <CodeTabPane key={i} id={id} onChange={this.props.onChange(id)}></CodeTabPane>
          })}
        </TabContent>
      </div>
    );
  }
}