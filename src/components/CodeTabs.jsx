import React from "react";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";

import cx from "classnames";
import CodeMirror from "react-codemirror";

import "codemirror/lib/codemirror.css";
import "./codetabs.css";

const CodeTabNav = ({ isActive, onClick, title, isTabClosable, onCloseTab }) =>
  <NavItem>
    <NavLink className={ cx({ active: isActive }) } onClick={onClick}>
      {isTabClosable && <span className="remove-tab-button" onClick={onCloseTab}>&times;</span>}
      {title}
    </NavLink>
  </NavItem>

const CodeTabPane = ({ id, onChange, code, options }) =>
  <TabPane tabId={id}>
    <CodeMirror {...{ options, onChange }} value={code} />
  </TabPane>


export default ({
  activeTab,
  addNewTab,
  onChangeFactory,
  onToggleFactory,
  options,
  tabs,
}) =>
  <section id="code-area">
    <Nav tabs>
      {tabs.map(({ id }) =>
        <CodeTabNav key={id}
          title={`Function ${id}`}
          isActive={activeTab === id}
          onClick={onToggleFactory(id)}
          isTabClosable={true}
        />
      )}
      <CodeTabNav title="+" onClick={addNewTab} tabIsClosable={false} />
    </Nav>
    <TabContent activeTab={activeTab}>
      {tabs.map(({ id, code }) =>
        <CodeTabPane key={id} {...{ id, code, options }}  onChange={onChangeFactory(id)} />
      )}
    </TabContent>
  </section>
