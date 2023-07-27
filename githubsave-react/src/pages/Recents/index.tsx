import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Card, Spinner } from "../../components";
import { useTheme } from "../../context/themeContext";
import { useQuery } from "react-query";
import axios from "axios";

interface ILiked {
  fileName: string;
  repoName: string;
  branch: string;
  filePath: string;
}

const index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const [liked, setLiked] = useState<ILiked[]>([]);
  const pages = useRef(0);

  const fetchRecent = async () => {
    const response = await axios
      .get(`http://localhost:3002/likes/recent?page=${pages.current}`, {
        headers: {
          "X-CSRF-MITIGATION-GHS": "1",
          Accept: "application/json",
        },
      })
      .then(({ data, status }) => {
        if (status == 401) {
          throw Error("Authorization error");
        } else if (status == 200) {
          return data;
        }
      });

    console.log({ response });
    pages.current += 1;
    return response;
  };

  const { isLoading, data, status, refetch } = useQuery("recent", fetchRecent);

  useEffect(() => {
    console.log(location.state);
    if (!isLoading && status == "success") {
      if (pages.current > 1) {
        setLiked((prev) => [...prev, ...data.likes]);
      } else setLiked(data.likes);
    }
  }, [data]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <div className="flex gap-3">
        {theme.dark ? (
          <img
            className="cursor-pointer"
            onClick={handleBack}
            src="./assets/dark/back-white.svg"
          />
        ) : (
          <img
            className="cursor-pointer"
            onClick={handleBack}
            src="./assets/light/back-black.svg"
          />
        )}
        <p>Recently Saved</p>
      </div>
      <div className="mt-2 bg-lightInset dark:bg-darkInset p-3 rounded-xl">
        {isLoading ? (
          <Spinner />
        ) : status == "success" ? (
          <>
            {liked.map(({ fileName, repoName, branch, filePath }) => (
              <Card
                fileName={fileName}
                repo={repoName}
                branch={branch}
                location={filePath}
              />
            ))}
            {pages.current < data.totalPages && (
              <button
                onClick={() => refetch()}
                className="w-full text-center py-1 bg-lightCard dark:bg-darkCard rounded-md"
              >
                More
              </button>
            )}
          </>
        ) : (
          <p>Ran into error</p>
        )}
      </div>
    </div>
  );
};

export default index;
