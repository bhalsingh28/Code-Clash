import iconUrl from "/icon.svg";
import "../styles/Profile.css";

function Profile() {
  return (
    <>
      <div>
        <div className="header">
          <img src={iconUrl} alt="Code Clash" />
          <h1> Code-Clash Rooms</h1>
        </div>

        <div>
          <ul>
            <li>Create a room</li>
            <li>Join a friend's room</li>
            <li>Compete in Competetive Round</li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Profile;
