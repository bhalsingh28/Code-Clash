import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/")
      .then((res) => res.text())
      .then(setMessage)
      .catch((err) => console.error("Fetch Error: ", err));
  }, []);

  return (
    <>
      <h1>Hello Code-Clash</h1>
      <p>Backend Says: {message}</p>
    </>
  );
}

export default App;
