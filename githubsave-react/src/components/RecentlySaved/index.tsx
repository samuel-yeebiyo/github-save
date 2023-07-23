import { Card } from "..";
import { useNavigate } from "react-router-dom";

const index = () => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/recents", {
      state: {
        recent: [1, 2, 3, 4],
      },
    });
  };

  return (
    <div className="rounded-xl p-3 bg-darkInset mb-3">
      <p className="mb-2">Recently Saved</p>
      {/* Card */}
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
      <button
        onClick={handleNavigation}
        className="w-full text-center h-6 bg-darkCard rounded-md"
      >
        See more
      </button>
    </div>
  );
};

export default index;
