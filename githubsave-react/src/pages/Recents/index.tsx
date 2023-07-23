import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Card } from "../../components";

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
      <div className="flex gap-3">
        <img onClick={handleBack} src="./assets/dark/back-white.svg" />
        <p>Recently Saved</p>
      </div>
      <div className="mt-2 bg-darkInset p-3 rounded-xl">
        <Card
          fileName="index.js"
          repo="samuel-yeebiyo/github-save"
          branch="main"
          location="/auth/components/"
        />
        <Card
          fileName="index.js"
          repo="samuel-yeebiyo/github-save"
          branch="main"
          location="/auth/components/"
        />
        <Card
          fileName="index.js"
          repo="samuel-yeebiyo/github-save"
          branch="main"
          location="/auth/components/"
        />
        <Card
          fileName="index.js"
          repo="samuel-yeebiyo/github-save"
          branch="main"
          location="/auth/components/"
        />
        <Card
          fileName="index.js"
          repo="samuel-yeebiyo/github-save"
          branch="main"
          location="/auth/components/"
        />
        <Card
          fileName="index.js"
          repo="samuel-yeebiyo/github-save"
          branch="main"
          location="/auth/components/"
        />
        <Card
          fileName="index.js"
          repo="samuel-yeebiyo/github-save"
          branch="main"
          location="/auth/components/"
        />
        <Card
          fileName="index.js"
          repo="samuel-yeebiyo/github-save"
          branch="main"
          location="/auth/components/"
        />
      </div>
    </div>
  );
};

export default index;
