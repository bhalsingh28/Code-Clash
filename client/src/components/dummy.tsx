export default function dummy() {
  return (
    <div>
      <GameNavbar timeLeft={timeLeft} />
      <div className="game-container">
        <div className="game-content">
          <div className="problem-section">
            <div className="problem-card">
              {problem ? (
                <>
                  <h2>{problem.title}</h2>
                  <p
                    className={`difficulty ${problem.difficulty.toLowerCase()}`}
                  >
                    Difficulty: {problem.difficulty}
                  </p>
                  <div className="problem-description">
                    <h3>Problem Statement:</h3>
                    <p>{problem.description}</p>
                  </div>
                  <div className="test-cases">
                    <h3>Test Cases:</h3>
                    {problem.testCases.map((tc, idx) => (
                      <div key={idx} className="test-case">
                        <p>
                          <strong>Input:</strong> {tc.input}
                        </p>
                        <p>
                          <strong>Output:</strong> {tc.output}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p>Loading problem solve</p>
              )}
            </div>
          </div>

          <div>
            <MonacoEditor
              problemTitle={problem?.title}
              onSubmit={handleSubmitCode}
              disabled={gameFinished}
              isSubmitted={hasSubmitted}
            />
          </div>

          <div className="status-section">
            <div className="players-info">
              <h3>Players:</h3>
              {room?.participants.map((participant) => (
                <div key={participant} className="player-status">
                  <span>{participant}</span>
                  {submissions.find((s) => s.userId === participant) && (
                    <span className="status-badge">
                      {submissions.find((s) => s.userId === participant)
                        ?.isCorrect
                        ? "✅ Correct"
                        : "❌ Wrong"}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
