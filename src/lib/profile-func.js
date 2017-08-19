export default async function (func, times = 30) {
  let results = [];

  while (times--) {
    const start = performance.now();

    await func && func();

    const duration = performance.now() - start;

    results.push(duration);
  }

  return results;
}