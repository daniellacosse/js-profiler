<Table>
  {this.renderResultHeader()}

  <tbody>
    {firstRow.map(
      (_, index) => this.renderResultRow(index)
    )}
  </tbody>
</Table>

renderResultHeader() {
  return (
    <thead>
      <tr>
        {this.state.results.map(
          (row, i) => <th key={i}>{i}</th>
        )}
      </tr>
    </thead>
  );
}

renderResultRow(index) {
  const { results } = this.state;

  let rows = [];
  let _countdown = results.length;

  while(_countdown--)
    rows.push(results[_countdown][index]);

  return (
    <tr key={index}>
      {rows.map((cell, i) => <td key={i}>{cell}ms</td>)}
    </tr>
  );
}