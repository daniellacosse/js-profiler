export default (timeinNs) => {
  const fixedNum = timeinNs.toFixed(3);

  if (timeinNs < 1) {
    return `${fixedNum * 1000}ns`
  }

  return `${fixedNum}ms`
}

