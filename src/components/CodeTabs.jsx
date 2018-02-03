import React, { Component } from "react";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";

import CodeMirror from "react-codemirror";
import "codemirror/mode/jsx/jsx";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/3024-night.css";

import "./CodeTabs.css";

export default ({
  activeTab,
  addNewTab,
  onChangeFactory,
  onToggleFactory,
  onTabCloseFactory,
  options,
  tabs,
}) => {
  const titlePrefix =
    tabs.length > 6
      ? "F"
      : "Function ";

  return (
    <section>
      <Nav tabs className="CodeTabs">
        {tabs.map(({ id }) =>
          <CodeTab key={id}
            title={titlePrefix + id}
            isActive={activeTab === id}
            isDisabled={tabs.length === 1}
            onSelect={onToggleFactory(id)}
            onClose={onTabCloseFactory(id)}
          />
        )}
        <CodeTab title="+" onSelect={addNewTab} isDisabled />
      </Nav>
      <TabContent activeTab={activeTab}>
        {tabs.map(({ id, code }) =>
          <CodePane {...{ id, code, options, key: id }}
            isActive={activeTab === id}
            onChange={onChangeFactory(id)}
          />
        )}
      </TabContent>
    </section>
  )
}

const CodeTab = ({ isActive, onSelect, title, isDisabled, onClose }) =>
  <NavItem>
    <NavLink className={
        isActive
          ? "CodeTab-active"
          : "CodeTab"
       }
      onClick={onSelect}
    >
      {
        !isDisabled && (
          <span className="CodeTabsRemoveButton" onClick={onClose}>
            &times;
          </span>
        )
      }

      {title}
    </NavLink>
  </NavItem>

  class CodePane extends Component {
    get editor() {
      return this.refs && this.refs.editor;
    }

    componentDidUpdate(prevProps) {
      if (this.props.isActiveTab && !prevProps.isActiveTab) {
        this.editor.focus();
      }
    }

    componentDidMount() {
      this.editor.getCodeMirror()
        .execCommand("selectAll");
    }

    render() {
      const { options, onChange, code } = this.props;

      return (
        <TabPane tabId={this.props.id}>
          <CodeMirror ref="editor" autoFocus {...{
              options,
              onChange,
              value: code
            }}
          />
        </TabPane>
      )
    }
  }