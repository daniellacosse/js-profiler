import React from 'react';
import { NavItem, NavLink} from 'reactstrap';
import classnames from 'classnames';


export default class CodeTabNav extends React.Component {
  // nest this under <Nav tabs> bootstrap element
  render() {
    return (
      <NavItem>
        <NavLink
          className={classnames({ active: this.props.active })}
          onClick={this.props.onClick}
        >
          {this.props.title}
        </NavLink>
      </NavItem>
    );
  }
}