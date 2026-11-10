// knowidea-ui/editor。CodeMirror を使う部品だけを、別の入口から出す(使わない画面に CodeMirror を読み込ませないため)
export { CodeEditor, type CodeEditorProps, type EditorCompletion, type EditorDiagnostic, type EditorPlace } from "./CodeEditor.js";
export { editorLanguageOfPath, editorOffset, editorPosition, type EditorLanguage } from "./editorText.js";
