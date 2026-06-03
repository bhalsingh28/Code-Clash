import Editor from "@monaco-editor/react";
import { useRef, useEffect } from "react";
import type * as Monaco from "monaco-editor";

interface MonacoEditorProps {
  problemTitle?: string;
  onSubmit: (code: string) => void;
  disabled?: boolean;
  isSubmitted?: boolean;
}

const defaultTemplate = `#include <bits/stdc++.h>
using namespace std;

int main() {

    // YOUR CODE HERE

    return 0;
}
`;

function MonacoEditor({
  onSubmit,
  disabled = false,
  isSubmitted = false,
}: MonacoEditorProps) {
  console.log("EDITOR RENDER");

  useEffect(() => {
    console.log("EDITOR MOUNT");

    return () => {
      console.log("EDITOR UNMOUNT");
    };
  }, []);
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);

  function handleEditorDidMount(editor: Monaco.editor.IStandaloneCodeEditor) {
    editorRef.current = editor;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = editorRef.current?.getValue() || "";

    if (!code.trim()) {
      return;
    }

    onSubmit(code);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Editor
        height="500px"
        defaultLanguage="cpp"
        defaultValue={defaultTemplate}
        onMount={handleEditorDidMount}
        options={{
          automaticLayout: true,
        }}
      />

      <button type="submit" disabled={disabled || isSubmitted}>
        {isSubmitted ? "Already Submitted" : "Submit Code"}
      </button>
    </form>
  );
}

export default MonacoEditor;
