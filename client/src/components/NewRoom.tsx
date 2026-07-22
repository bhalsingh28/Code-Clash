function NewRoom() {
  return (
    <>
      <section>
        <div>
          <h1>Room</h1>
          <h2>Create or Join Coding Battles</h2>
          <p>
            Challenge your friend in real time contests, solve problems
            together, and climb live leaderboard
          </p>
        </div>

        <div className="room">
          <div className="join-room">
            <div className="head">
              <img src="" alt="" />
              <div>
                <h2>Join Room</h2>
                <p>Enter an invite code</p>
              </div>
            </div>
            <input type="text" placeholder="Enter Room Code" />
            <button>Join Room</button>
          </div>

          <div className="join-room">
            <div className="head">
              <img src="" alt="" />
              <div>
                <h2>Create Room</h2>
                <p>Start a private coding room and invite your friend</p>
              </div>
            </div>
            <ul>
              <li>Generate invite code</li>
              <li>Choose Problem Difficulty</li>
              <li>Set Timer</li>
              <li>Live Leader board</li>
            </ul>
            <button>Create Room</button>
          </div>
        </div>
      </section>
    </>
  );
}

export default NewRoom;
