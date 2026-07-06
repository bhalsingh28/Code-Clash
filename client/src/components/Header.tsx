import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };
  return (
    <>
      <div className=" h-20 bg-[#1B1B1F]">
        <div className="flex ">
          <span className="" onClick={handleClick}>
            CodeClash
          </span>
        </div>
      </div>
    </>
  );
}

export default Header;
