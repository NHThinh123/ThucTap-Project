const { PythonShell } = require("python-shell");

console.log("[Test] Starting PythonShell test...");

const options = {
  mode: "text",
  pythonPath: "python",
  pythonOptions: ["-u"],
};

PythonShell.runString('print("Test PythonShell")', options, (err, results) => {
  console.log("[Test] PythonShell:", err, results);
});

console.log("[Test] PythonShell command sent");
