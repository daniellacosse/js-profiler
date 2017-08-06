export default (codes = []) => {
  return new Promise((resolve, reject) => {
    document.getElementById("_PROFILER_").remove();

    const newProfilerScript = document.createElement("script");

    newProfilerScript.id = "_PROFILER_";

    newProfilerScript.onload = resolve;
    newProfilerScript.onerror = reject;

    newProfilerScript.src = `data:text/javascript;base64,${
      btoa(
        codes.map((code, i) => `window._func${i}=${code};`).join('')
      )
    }`

    document.body.append(newProfilerScript);
  });
}