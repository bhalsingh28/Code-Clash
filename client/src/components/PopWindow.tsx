import "../styles/CreateRoom.css";

interface PopWindowProps {
  onClose: () => void;
  message: string;
}

function PopWindow({ onClose, message }: PopWindowProps) {
  return (
    <div className="overlay">
      <div className="modal">
        <button onClick={onClose}>X</button>

        <div className="w-2xs h-16">
          <span>{message}</span>
        </div>
      </div>
    </div>
  );
}

export default PopWindow;
