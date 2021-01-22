import * as monaco from 'monaco-editor';
import * as ts from 'typescript';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/main.scss';

const scriptId = 'scriptID';

/**
 * 1. work with typescript as files without raw loader
 * 2. always have a method that re renders everything
 * 3. call it on page load.
 * 4. use decorators over the methods.
 * 5. in the first evaluation: construct a new editor for the decorated method. use function.toString in order to get the source code.
 * 6. link the editor ctrl enter to first do step 7. and the re render everything.
 * 7. take the value of the editor, wrap it into the function name and attach it to a separate script which is updated every time.
 */

const editor = monaco.editor.create(document.getElementById('container')!, {
    value: [
        '// Press ctrl + enter to execute the code in this editor',
        'function x() {',
        '\tconst str: string = "Hello World";',
        '\tconst test: Number = str;',
        '\tconsole.log(str);',
        '}'
    ].join('\n'),
    language: 'typescript',
    theme: 'vs-dark'
});

// Taken from: https://stackoverflow.com/questions/939326/execute-javascript-code-stored-as-a-string
function executeScript (source: string, scriptID: string) {
    // remove the old script if it exists
    const oldScript = document.getElementById(scriptID);
    if (oldScript) {
        oldScript.remove();
    }
    const newScript = document.createElement('script');
    newScript.setAttribute('id', scriptID);
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
        target: ts.ScriptTarget.ES2020
    }
};

// Hook for doing stuff on content change (code edit).
editor.onDidChangeModelContent(eve => {
    console.log(eve);
});

const executionCommand = editor.addCommand(
    monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
    function () {
        const editorContent = editor.getValue();
        const transpile = ts.transpileModule(editorContent, transpileOptions);
        console.log(transpile);
        executeScript(transpile.outputText, scriptId);
    }
);
console.log(executionCommand);
