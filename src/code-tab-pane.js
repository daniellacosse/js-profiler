import React from 'react';
import { TabPane } from 'reactstrap';
import CodeMirror from 'react-codemirror';

export default class CodeTabPane extends React.Component {
  // nest this under <Nav tabs> bootstrap element
  render() {
    return (
      <TabPane tabId={this.props.id}>
        <CodeMirror onChange={this.props.onChange}/>
      </TabPane>
    )
  }
}