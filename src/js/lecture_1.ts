import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/main.scss';
import * as monaco from 'monaco-editor';
import { EditableCode, initEditable } from './editable_code';

// The render loop.
function execute() {
    console.log(temp.editable());
}

// The class that contains one editable code segment.
class EditorTry implements EditableCode {
    editor: monaco.editor.IStandaloneCodeEditor;
    preEditable() {}
    postEditable(str: string) {
        return str;
    }

    @initEditable('container', execute)
    init() {
        return this;
    }

    editable() {
        const str = 'Hello World';
        console.log(str);
        console.log(this.editor);
    }
}

const temp = new EditorTry().init();
execute();
