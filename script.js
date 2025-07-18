let editor, pyodide;

require.config({ paths: { vs: "https://unpkg.com/monaco-editor@0.45.0/min/vs" } });

require(["vs/editor/editor.main"], function () {
  editor = monaco.editor.create(document.getElementById("editor-container"), {
    value: `print("Hello from Python!")`,
    language: "python",
    theme: "vs-dark",
    automaticLayout: true,
  });
});

async function loadPyodideAndRun() {
  pyodide = await loadPyodide();
  logToTerminal("✅ Pyodide آماده است.");
}

function logToTerminal(message) {
  const terminal = document.getElementById("terminal");
  terminal.textContent += message + "\n";
  terminal.scrollTop = terminal.scrollHeight;
}

async function runPythonCode() {
  const code = editor.getValue();
  logToTerminal(">>> اجرای کد ...\n" + code);
  try {
    const result = await pyodide.runPythonAsync(code);
    if (result !== undefined) logToTerminal(result.toString());
  } catch (err) {
    logToTerminal("⛔ خطا:\n" + err);
  }
}

document.getElementById("run-button").addEventListener("click", runPythonCode);

loadPyodideAndRun();
