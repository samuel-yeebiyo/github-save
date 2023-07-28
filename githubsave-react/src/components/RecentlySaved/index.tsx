import { Card, Empty } from "..";
import { useNavigate } from "react-router-dom";

interface ILiked {
  fileName: string;
  repoName: string;
  branch: string;
  filePath: string;
}

const index = ({ liked }: { liked: ILiked[] }) => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/recents");
  };

  return (
    <div className="rounded-xl p-3 bg-lightInset dark:bg-darkInset mb-3">
      <p className="mb-2">Recently Saved</p>
      {liked.length > 0 ? (
        liked
          .slice(0, 2)
          .map(({ fileName, repoName, branch, filePath }) => (
            <Card
              fileName={fileName}
              repo={repoName}
              branch={branch}
              location={filePath}
            />
          ))
      ) : (
        <Empty />
      )}
      {liked.length > 2 && (
        <button
          onClick={handleNavigation}
          className="w-full text-center py-1 bg-lightCard dark:bg-darkCard rounded-md"
        >
          See more
        </button>
      )}
    </div>
  );
};

export default index;
