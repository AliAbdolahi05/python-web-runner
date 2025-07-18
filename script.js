let pyodideReady = loadPyodide();

require.config({ paths: { vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs" } });
require(["vs/editor/editor.main"], function () {
  window.editor = monaco.editor.create(document.getElementById("editor"), {
    value: 'print("Hello from Pyodide!")',
    language: "python",
    theme: "vs-dark",
    automaticLayout: true
  });
});

document.getElementById("run-btn").addEventListener("click", async () => {
  const pyodide = await pyodideReady;
  const code = window.editor.getValue();
  const outputElement = document.getElementById("output");

  outputElement.textContent = "Running...\n";

  try {
    let result = await pyodide.runPythonAsync(code);
    if (result !== undefined) {
      outputElement.textContent += result + "\n";
    }
  } catch (err) {
    outputElement.textContent += err + "\n";
  }
});
