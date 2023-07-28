import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useTheme } from "../../context/themeContext";
import { useQuery } from "react-query";
import axios from "axios";

import { Empty, RepoCard, Spinner } from "../../components";

const index = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [repos, setRepos] = useState<any>([]);
  const pages = useRef(0);

  const fetchLiked = async () => {
    const response = await axios
      .get(
        `https://api.githubsave.samuelyyy.com/likes/repo?page=${pages.current}`,
        {
          headers: {
            "X-CSRF-MITIGATION-GHS": "1",
            Accept: "application/json",
          },
        }
      )
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

  const { isLoading, data, status, refetch } = useQuery("repos", fetchLiked);

  useEffect(() => {
    if (!isLoading && status == "success") {
      if (pages.current > 1) {
        setRepos((prev: any) => [...prev, ...data.repos]);
      } else setRepos(data.repos);
    }
  }, [data]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <div className="flex gap-3 w-full">
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
        <p>By Repository</p>
      </div>
      <div className="mt-2 p-3 rounded-xl">
        {isLoading ? (
          <Spinner />
        ) : status == "success" ? (
          <>
            {repos.length > 0 ? (
              repos.map(({ _id, image, files }: any) => (
                <RepoCard repo={_id} image={image} files={files} />
              ))
            ) : (
              <Empty />
            )}
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
        {/* Repo card */}
      </div>
    </div>
  );
};

export default index;
