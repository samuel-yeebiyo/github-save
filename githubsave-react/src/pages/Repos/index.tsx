import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
// import { Card } from "../../components";

const index = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(location.state);
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex gap-3 w-full">
          <img onClick={handleBack} src="./assets/dark/back-white.svg" />
          <p>By Repository</p>
        </div>
        <img src="./assets/dark/searching-white.svg" />
      </div>
      <div className="mt-2 bg-darkInset p-3 rounded-xl">
        {/* Repo card */}
        <div className="">
          <div className="h-[89px]">
            <img src="" alt="repoooooo image" />
          </div>
          <div>
            <p>You have {2} liked file(s)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default index;
