import "../styles/CreateRoom.css";
interface PopWindowProps {
  onClose: () => void;
}

function PopWindow({ onClose }: PopWindowProps) {
  return (
    <div className="overlay">
      <div className="modal">
        <button onClick={onClose}>X</button>

        <div className="w-2xs h-16">
          <p>TestCases Failed</p>
        </div>
      </div>
    </div>
  );
}

export default PopWindow;
