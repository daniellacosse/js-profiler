import React, { Component } from "react";
import PropTypes from "prop-types";
import { Table } from "reactstrap";

const resultContext = {
  data: PropTypes.array
};

export default class RawDataTable extends Component {
  static childContextTypes = resultContext;

  getChildContext() {
    return {
      data: this.props.data
    }
  }

  render() {
    const { data } = this.props;

    return (
      <Table>
        <TableHeader columns={data.length}/>

        <TableBody>
          {(_, index) => <TableRow index={index} />}
        </TableBody>
      </Table>
    );
  }
}

class TableHeader extends Component {
  static contextTypes = resultContext;

  render() {
    return (
      <thead>
        <tr>
          {this.context.data.map(
            (row, index) => <th key={index}>{index}</th>
          )}
        </tr>
      </thead>
    );
  }
}

class TableBody extends Component {
  static contextTypes = resultContext;

  render() {
    return this.context.data.map(
      (row, index) => row.map(this.props.children)
    )
  }
}

class TableRow extends Component {
  static contextTypes = resultContext;

  render() {
    const { index } = this.props;
    const cells = this.context.data[index];

    return (
      <tr key={index}>
        {cells.map((cell, j) => <td key={j}>{cell}ms</td>)}
      </tr>
    );
  }
}