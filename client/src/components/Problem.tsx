// import { useState, useEffect } from "react";
// import { getProblem } from "../api/problemApi";

// interface ProblemType {
//   title: string;
//   statement: string;
//   difficulty: "Easy" | "Medium" | "Hard";
//   input: string;
//   expected_output: string;
// }

// function Problem() {
//   const [problem, setProblem] = useState<ProblemType | null>(null);

//   useEffect(() => {
//     const fetchProblem = async () => {
//       try {
//         const data = await getProblem();
//         setProblem(data);
//         console.log(data);
//       } catch (err) {
//         console.error("Failed to fetch problem", err);
//       }
//     };

//     fetchProblem();
//   }, []);

//   if (!problem) return <p>Loading problem.</p>;

//   return (
//     <div>
//       <h2>{problem.title}</h2>
//       <p>
//         <strong>Difficulty:</strong> {problem.difficulty}
//       </p>
//       <p>
//         <strong>Statement:</strong> {problem.statement}
//       </p>
//       <p>
//         <strong>Input:</strong> <pre>{problem.input}</pre>
//       </p>
//       <p>
//         <strong>Expected Output:</strong> <pre>{problem.expected_output}</pre>
//       </p>
//     </div>
//   );
// }

// export default Problem;

function Problem({ problem }: { problem: ProblemType }) {
  return (
    <div>
      <h2 className="text-2xl font-bold">{problem.title}</h2>

      <p className={`difficulty ${problem.difficulty.toLowerCase()} mt-2`}>
        <strong>Difficulty : </strong>
        {problem.difficulty == "Easy" && (
          <strong className="text-green-400">Easy</strong>
        )}
        {problem.difficulty == "Medium" && (
          <strong className="text-yellow-400">Easy</strong>
        )}
        {problem.difficulty == "Hard" && (
          <strong className="text-red-400">Hard</strong>
        )}
      </p>
      <hr className="mt-2" />

      <div className="mt-2">
        <h3 className="text-lg font-semibold mb-2">Problem Statement</h3>

        <p className="whitespace-pre-wrap leading-7">{problem.description}</p>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Test Cases</h3>

        {problem.testCases.map((tc, idx) => (
          <div key={idx} className="mb-4 rounded-xl bg-primary-black p-4">
            <p>
              <strong>Input:</strong> {tc.input}
            </p>

            <p className="mt-2">
              <strong>Output:</strong> {tc.output}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Problem;
