import React from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';

import cx from 'classnames';
import CodeMirror from 'react-codemirror';

const CodeTabNav = ({ isActive, onClick, title }) =>
  <NavItem>
    <NavLink className={cx({ active: isActive })} onClick={onClick}>
      {title}
    </NavLink>
  </NavItem>

const CodeTabPane = ({ id, onChange }) =>
  <TabPane tabId={id}>
    <CodeMirror onChange={onChange}/>
  </TabPane>

export default ({ tabs, activeTab, addNewTab, onToggle, onChange }) =>
  <section id="code-area">
    <Nav tabs>
      {tabs.map(({ id }) =>
        <CodeTabNav key={id}
          title={`Function ${id}`}
          isActive={activeTab === id}
          onClick={() => onToggle(id)} />
      )}
      <CodeTabNav title="+" onClick={addNewTab} />
    </Nav>
    <TabContent activeTab={activeTab}>
      {tabs.map(({id}, i) =>
        <CodeTabPane key={i} id={id} onChange={onChange(id)} />
      )}
    </TabContent>
  </section>
