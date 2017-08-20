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
    const length = this.context.data[0].length;

    return (
      <thead>
        <tr>
          {this.context.data[0].map(
            (row, index) => <th key={index}>Function {index + 1}</th>
          )}
        </tr>
      </thead>
    );
  }
}

class TableBody extends Component {
  static contextTypes = resultContext;

  render() {
    return (
      <tbody>
        {this.context.data.map(
          (row, index) => row.map(this.props.children)
        )}
      </tbody>
    )
  }
}

class TableRow extends Component {
  static contextTypes = resultContext;

  render() {
    const { index } = this.props;
    const cells = this.context.data[index];
    const length = cells.length;
    return (
      <tr key={index}>
        {cells.map((cell, j) => <td key={j}>{cell.toFixed(3)}ms</td>)}
      </tr>
    );
  }
}
