import Editor from "@monaco-editor/react";
import { useRef } from "react";
import type * as Monaco from "monaco-editor";
import code from "../assets/code.svg";
// import down from "../assets/down.svg";
import copy from "../assets/copy.svg";
import reset from "../assets/reset.svg";
import submit from "../assets/submit.svg";
import run from "../assets/run.svg";

import toast, { Toaster } from "react-hot-toast";

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
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);

  function handleEditorDidMount(editor: Monaco.editor.IStandaloneCodeEditor) {
    editorRef.current = editor;
  }

  const handleReset = () => {
    editorRef.current?.setValue(defaultTemplate);
    toast("Reset Successful");
  };

  const handleCopy = async () => {
    const code = editorRef.current?.getValue() || "";
    await navigator.clipboard.writeText(code);
    toast("Copied");
  };

  const handleRun = () => {
    return;
  };

  const handleSubmit = () => {
    const code = editorRef.current?.getValue() || "";
    if (!code.trim()) {
      return;
    }
    onSubmit(code);
  };

  return (
    <div className="rounded-2xl  bg-box-black">
      <div className="flex h-10 justify-between px-5">
        <div className="flex items-center gap-1">
          <img className="w-7 h-7" src={code} alt="" />
          <span>Code</span>
        </div>
        <div className="flex items-center gap-1">
          {/* <span className="text-xl">C++</span> */}
          {/* <img className="h-7 w-7" src={down} alt="" /> */}
        </div>
        <div className="flex gap-5">
          <div className="flex items-center">
            <button
              className="p-1.5 hover:bg-[#1E1E1E] hover:rounded-2xl"
              type="button"
              onClick={handleCopy}
              title="Copy Code"
            >
              <Toaster
                toastOptions={{
                  duration: 1500,
                  style: {
                    background: "#363636",
                    color: "#fff",
                  },
                }}
              />
              <img className="h-5 w-5" src={copy} alt="" />
            </button>
          </div>
          <div className=" flex items-center ">
            <button
              className="p-1.5 hover:bg-[#1E1E1E] hover:rounded-2xl"
              type="button"
              onClick={handleReset}
              title="Reset Editor"
            >
              <img className="h-5 w-5" src={reset} alt="Reset" />
            </button>
            <Toaster
              toastOptions={{
                duration: 1500,
                style: {
                  background: "#363636",
                  color: "#fff",
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className="">
        <Editor
          height="530px"
          defaultLanguage="cpp"
          defaultValue={defaultTemplate}
          theme="vs-dark"
          onMount={handleEditorDidMount}
          options={{
            automaticLayout: true,
          }}
        />

        <div className="flex gap-4 px-4 py-4">
          <button
            className="bg-[#1a991a] rounded-xl p-2 px-3 hover:bg-[#136e13]"
            onClick={handleRun}
            type="button"
          >
            <div className="flex items-center gap-2">
              <img className="w-7 h-7" src={run} alt="" />
              <span>Run</span>
            </div>
          </button>
          <button
            className="bg-[#444bd3] rounded-xl p-2 px-3 hover:bg-[#2e3396]"
            type="submit"
            onClick={handleSubmit}
            disabled={disabled || isSubmitted}
          >
            <div className="flex items-center gap-2">
              <img className="w-7 h-7" src={submit} alt="" />
              <span>Submit</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default MonacoEditor;
