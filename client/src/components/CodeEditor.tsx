import { useState, type ChangeEvent, type FormEvent } from "react";
import "../styles/CodeEditor.css";

interface CodeEditorProps {
  problemTitle?: string;
  onSubmit: (code: string) => void;
  disabled?: boolean;
  isSubmitted?: boolean;
}

// C++ class templates for each problem (LeetCode style)
const cpluslusTemplates: { [key: string]: string } = {
  "Two Sum": `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {

        // YOUR CODE HERE

    }
};`,

  "Reverse String": `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    string reverseString(string s) {

        // YOUR CODE HERE

    }
};`,

  "Palindrome Number": `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    bool isPalindrome(int x) {

        // YOUR CODE HERE

    }
};`,

  "Contains Duplicate": `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    bool containsDuplicate(vector<int>& nums) {

        // YOUR CODE HERE

    }
};`,

  "Valid Parentheses": `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    bool isValid(string s) {

        // YOUR CODE HERE

    }
};`,

  "Longest Substring Without Repeating Characters": `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int lengthOfLongestSubstring(string s) {

        // YOUR CODE HERE

    }
};`,

  "Maximum Subarray": `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int maxSubArray(vector<int>& nums) {

        // YOUR CODE HERE

    }
};`,

  "Binary Search": `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int search(vector<int>& nums, int target) {

        // YOUR CODE HERE

    }
};`,

  "Remove Duplicates from Sorted Array": `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int removeDuplicates(vector<int>& nums) {

        // YOUR CODE HERE

    }
};`,

  "Sum of Two Numbers": `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int sum(int a, int b) {

        // YOUR CODE HERE

    }
};`,

  "Factorial": `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int factorial(int n) {

        // YOUR CODE HERE

    }
};`,

  "Fibonacci Number": `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int fib(int n) {

        // YOUR CODE HERE

    }
};`,
};

function CodeEditor({
  problemTitle = "",
  onSubmit,
  disabled = false,
  isSubmitted = false,
}: CodeEditorProps) {
  const [code, setCode] = useState(
    cpluslusTemplates[problemTitle] ||
      `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    // YOUR CODE HERE
};`
  );

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      onSubmit(code);
    }
  };

  return (
    <div className="code-editor-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="code-input">C++ Solution:</label>
        <div className="editor-info">
          📝 Only edit the <code>// YOUR CODE HERE</code> section inside the class
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
          spellCheck="false"
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


