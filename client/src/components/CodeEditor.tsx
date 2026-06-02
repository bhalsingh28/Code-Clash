import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import "../styles/CodeEditor.css";

interface CodeEditorProps {
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

function CodeEditor({
  problemTitle = "",
  onSubmit,
  disabled = false,
  isSubmitted = false,
}: CodeEditorProps) {
  const [code, setCode] = useState(defaultTemplate);

  useEffect(() => {
    setCode(defaultTemplate);
  }, [problemTitle]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      return;
    }

    onSubmit(code);
  };

  return (
    <div className="code-editor-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="code-input">C++ Solution:</label>

        <div className="editor-info">
          📝 Write a complete C++ program including <code>main()</code>
        </div>

        <textarea
          id="code-input"
          className="code-input"
          value={code}
          onChange={handleChange}
          placeholder="Write your C++ solution here..."
          disabled={disabled}
          rows={20}
          cols={50}
          spellCheck={false}
        />

        <button
          type="submit"
          disabled={disabled || isSubmitted}
          className="submit-btn"
        >
          {isSubmitted ? "Already Submitted" : "Submit Code"}
        </button>
      </form>
    </div>
  );
}

export default CodeEditor;