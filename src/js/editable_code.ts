import * as monaco from 'monaco-editor';
import * as ts from 'typescript';

export interface EditableCode {
    editor: monaco.editor.IStandaloneCodeEditor;
    // The init function must be called after constructing the element.
    // It needs to have the @initEditable decorator.
    // This creates the editor and replaces the function.
    init(): any;
    // non editable code that is placed before the editable code
    // Example: predefine variables.
    preEditable(): any;
    // non editable code that is placed after the editable code
    // Example: return values.
    postEditable(...args: any[]): any;
    editable(): any;
}

export function initEditable(containerID: string, executeFunction: Function) {
    return function (targetObject: EditableCode, propertyKey: string, descriptor: PropertyDescriptor) {
        // construct the editor.
        if (targetObject.editor == null) {
            const functionString = targetObject.editable.toString();
            const functionContentString = calculateFunctionContentSubstring(functionString);
            const editor = createEditor(containerID, functionContentString);
            targetObject.editable = () => constructNewEditableFunction(functionContentString, targetObject)();
            targetObject.editor = editor;
            editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
                editor.trigger(`anyString`, 'editor.action.formatDocument', undefined);
                const editorContent = editor.getValue();
                const transpile = ts.transpileModule(editorContent, transpileOptions);
                if (transpile.diagnostics !== undefined && transpile.diagnostics.length > 0) {
                    console.error(
                        `Compilation of the function failed: ${transpile.diagnostics.toString()} \nContent: ${editorContent}`
                    );
                } else {
                    // Replace the new function with the existing one.
                    targetObject.editable = () => constructNewEditableFunction(functionContentString, targetObject)();
                    executeFunction();
                }
            });
        }
    };
}

function constructNewEditableFunction(editableFunctionContentString: string, targetObject: EditableCode): Function {
    const strictDefinition = '"use strict"';
    const borderString = ';\n';
    const preFunctionContentString = calculateFunctionContentSubstring(targetObject.preEditable.toString());
    const postFunctionContentString = calculateFunctionContentSubstring(targetObject.postEditable.toString());
    const newFunction = new Function(
        strictDefinition +
            borderString +
            preFunctionContentString +
            borderString +
            editableFunctionContentString +
            borderString +
            postFunctionContentString
    );
    // The new Function is similar to eval() but les dangerous.
    // call lets us change the context to the target object.
    // Thus this points to the correct object.
    // Wrap it into a try catch block to prevent forwarding errors.
    return () => {
        try {
            return newFunction.call(targetObject);
        } catch (e) {
            console.error(e);
        }
    };
}

function calculateFunctionContentSubstring(functionString: string): string {
    const functionOpeningParenthesisIndex = functionString.indexOf('{');
    const functionClosingParenthesisIndex = functionString.lastIndexOf('}');
    return functionString.substring(functionOpeningParenthesisIndex + 1, functionClosingParenthesisIndex - 1).trim();
}

function createEditor(containerID: string, content: string): monaco.editor.IStandaloneCodeEditor {
    const container = document.getElementById(containerID);
    if (container === null) {
        throw new ReferenceError(
            `Expected to find container element for the editor (empty div element) with the id ${containerID}. No Editor has been created.`
        );
    }
    const editor = monaco.editor.create(container, {
        value: content,
        language: 'typescript',
        theme: 'vs-dark',
        automaticLayout: true,
        autoIndent: 'full',
        contextmenu: false,
        formatOnType: true,
        // readOnly: true,
    });
    editor.onDidScrollChange(() => editor.trigger(`anyString`, 'editor.action.formatDocument', undefined));
    return editor;
}

const transpileOptions = {
    reportDiagnostics: true,
    compilerOptions: {
        noEmitOnError: true,
        noImplicitAny: true,
        strick: true,
        strictNullChecks: true,
        allowSyntheticDefaultImports: true,
        preserveConstEnums: true,
        target: ts.ScriptTarget.ES2020,
    },
};
