import React from "react";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";

import cx from "classnames";
import CodeMirror from "react-codemirror";

import "codemirror/lib/codemirror.css";

const CodeTabNav = ({ isActive, onClick, title }) =>
  <NavItem>
    <NavLink className={ cx({ active: isActive }) } onClick={onClick}>
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
        />
      )}
      <CodeTabNav title="+" onClick={addNewTab} />
    </Nav>
    <TabContent activeTab={activeTab}>
      {tabs.map(({ id, code }) =>
        <CodeTabPane key={id} {...{ id, code, options }}  onChange={onChangeFactory(id)} />
      )}
    </TabContent>
  </section>
