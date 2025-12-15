import { useState, useEffect } from "react";
import { getProblem } from "../api/problemApi";

interface ProblemType {
  title: string;
  statement: string;
  difficulty: "Easy" | "Medium" | "Hard";
  input: string;
  expected_output: string;
}

function Problem() {
  const [problem, setProblem] = useState<ProblemType | null>(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const data = await getProblem();
        setProblem(data);
      } catch (err) {
        console.error("Failed to fetch problem", err);
      }
    };

    fetchProblem();
  }, []);

  if (!problem) return <p>Loading problem...</p>;

  return (
    <div>
      <h2>{problem.title}</h2>
      <p>
        <strong>Difficulty:</strong> {problem.difficulty}
      </p>
      <p>
        <strong>Statement:</strong> {problem.statement}
      </p>
      <p>
        <strong>Input:</strong> <pre>{problem.input}</pre>
      </p>
      <p>
        <strong>Expected Output:</strong> <pre>{problem.expected_output}</pre>
      </p>
    </div>
  );
}

export default Problem;
