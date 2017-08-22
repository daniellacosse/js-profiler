export default (data) => {
  let transposed = [];

  for (let i = 0; i < data[0].length; i++) {
    transposed.push(new Array(data.length));
  }

  for (let i = 0; i < data.length; i++) {
    let row = data[i];
    for (let j = 0; j < row.length; j++) {
      transposed[j][i] = data[i][j];
    }
  }

  return transposed;
}