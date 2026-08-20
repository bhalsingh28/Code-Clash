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
