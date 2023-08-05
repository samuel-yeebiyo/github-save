import { Card, Empty, ErrorMessage } from "..";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { Spinner } from "..";
import browser from "webextension-polyfill";

interface ILiked {
  fileName: string;
  repoName: string;
  branch: string;
  filePath: string;
  url: string;
}

const index = () => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState<ILiked[]>([]);
  const limit = 2;

  const handleNavigation = () => {
    navigate("/recents");
  };

  const fetchMostRecent = async () => {
    const response = await axios
      .get(
        `https://api.githubsave.samuelyyy.com/likes/recent?page=0&limit=${3}`,
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

    return response;
  };

  const { isLoading, isFetching, data, status, refetch } = useQuery(
    "mostRecent",
    fetchMostRecent
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
          refetch();
        }
      });
  };

  useEffect(() => {
    if (!isLoading && status == "success") {
      setLiked(data.likes);
    }
  }, [data]);

  return (
    <div className="rounded-xl p-3 bg-lightInset dark:bg-darkInset mb-3">
      <p className="mb-2">Recently Saved</p>
      {isFetching ? (
        <Spinner />
      ) : status == "success" ? (
        <>
          {liked.length > 0 ? (
            <>
              {liked.map(
                ({ fileName, url, repoName, branch, filePath }, idx: number) =>
                  idx < limit && (
                    <Card
                      url={url}
                      handleDelete={handleDelete}
                      fileName={fileName}
                      repo={repoName}
                      branch={branch}
                      location={filePath}
                    />
                  )
              )}
              {data && limit < liked.length && (
                <button
                  onClick={() => handleNavigation()}
                  className="w-full text-center py-1 bg-lightCard dark:bg-darkCard rounded-md"
                >
                  See More
                </button>
              )}
            </>
          ) : (
            <Empty />
          )}
        </>
      ) : (
        <ErrorMessage />
      )}
    </div>
  );
};

export default index;
