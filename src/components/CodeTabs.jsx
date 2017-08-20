import React from "react";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";

import cx from "classnames";
import CodeMirror from "react-codemirror";

import "codemirror/mode/jsx/jsx";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/3024-night.css";

const CodeTabNav = ({ isActive, onClick, title }) =>
  <NavItem>
    <NavLink className={ cx({ active: isActive }) } style={{
      background: isActive && "rgb(9, 3, 0)",
      borderColor: isActive && "rgb(9, 3, 0)",
      color: isActive ? "white" : "gray",
      cursor: "pointer"
    }}
    onClick={onClick}>
      {title}
    </NavLink>
  </NavItem>

const CodeTabPane = ({ id, onChange, code, options }) =>
  <TabPane tabId={id}>
    <CodeMirror {...{ options, onChange }} value={code} autoFocus />
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
    <Nav tabs style={{ marginLeft: 30, border: 0 }}>
      {tabs.map(({ id }) =>
        <CodeTabNav key={id}
          title={`${tabs.length > 6 ? "F" : "Function"} ${id}`}
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
