import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Card, Empty, ErrorMessage, Spinner } from "../../components";
import { useTheme } from "../../context/themeContext";
import { useQuery } from "react-query";
import axios from "axios";
import browser from "webextension-polyfill";
import { ILiked } from "../../utils/interface/liked.interface";

const index = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [liked, setLiked] = useState<ILiked[]>([]);
  const pages = useRef(0);

  const fetchRecent = async () => {
    const response = await axios
      .get(
        `https://api.githubsave.samuelyyy.com/likes/recent?page=${pages.current}`,
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

    pages.current += 1;
    return response;
  };

  const { isLoading, isFetching, data, status, refetch } = useQuery(
    "recent",
    fetchRecent
  );

  const handleDelete = async (url: string) => {
    await axios
      .post(
        `https://api.githubsave.samuelyyy.com/like`,
        {
          likedFile: url,
        },
        {
          headers: {
            "X-CSRF-MITIGATION-GHS": "1",
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Credentials": "true",
          },
          withCredentials: true,
        }
      )
      .then(async ({ status }) => {
        if (status == 401) {
          throw Error("Authorization error");
        } else if (status == 200) {
          const allTabs = await browser.tabs.query({
            url: url,
          });
          console.log({ allTabs });
          if (allTabs.length > 0) {
            allTabs.map(async (tab) => {
              if (tab.id)
                await browser.tabs.sendMessage(tab.id, { message: "start" });
            });
          }
          pages.current -= 1;
          refetch();
        }
      });
  };

  useEffect(() => {
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
        {isFetching ? (
          <Spinner />
        ) : status == "success" ? (
          <>
            {liked.length > 0 ? (
              liked.map(({ fileName, url, repoName, branch, filePath }) => (
                <Card
                  handleDelete={handleDelete}
                  url={url}
                  fileName={fileName}
                  repo={repoName}
                  branch={branch}
                  location={filePath}
                />
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
          <ErrorMessage />
        )}
      </div>
    </div>
  );
};

export default index;
