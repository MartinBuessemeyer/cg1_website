'use strict';
import * as monaco from 'monaco-editor';
import * as ts from 'typescript';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/main.css';

const scriptId = 'scriptID';

const editor = monaco.editor.create(document.getElementById('container'), {
  value: [
    '// Press ctrl + enter to execute the code in this editor',
    'function x() {',
    '\tconst str: string = "Hello World";',
    '\tconst test: Number = str;',
    '\tconsole.log(str);',
    '}',
  ].join('\n'),
  language: 'typescript',
  theme: 'vs-dark',
});

// Taken from: https://stackoverflow.com/questions/939326/execute-javascript-code-stored-as-a-string
function executeScript(source) {
  // remove the old script if it exists
  const oldScript = document.getElementById(scriptId);
  if (oldScript) {
    oldScript.remove();
  }
  const newScript = document.createElement('script');
  newScript.setAttribute('id', scriptId);
  newScript.onload = newScript.onerror = function () {
    this.remove();
  };
  newScript.src = 'data:text/plain;base64,' + btoa(source);
  document.body.appendChild(newScript);
}

const transpileOptions = {
  reportDiagnostics: true,
  compilerOptions: {
    noEmitOnError: true,
    noImplicitAny: true,
    strick: true,
    typeCheck: true,
    strictNullChecks: true,
    allowSyntheticDefaultImports: true,
    preserveConstEnums: true,
    alwaysStrict: true,
    target: ts.ScriptTarget.ES2020,
  },
};

// Hook for doing stuff on content change (code edit).
editor.onDidChangeContentModel(event => {});

const executionCommand = editor.addCommand(
  monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
  function () {
    const editorContent = editor.getValue();
    const transpile = ts.transpileModule(editorContent, transpileOptions);
    console.log(transpile);
    executeScript(transpile.outputText);
  }
);
