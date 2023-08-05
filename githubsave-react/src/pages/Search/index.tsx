import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import type { ChangeEvent } from "react";
import { Card, Spinner } from "../../components";
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

  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const searchLiked = async () => {
    const response = await axios
      .get(
        `https://api.githubsave.samuelyyy.com/likes/search?page=${pages.current}&term=${searchTerm}`,
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

  const nextPage = () => {
    pages.current += 1;
    refetch();
  };

  const { isLoading, isFetching, data, status, refetch } = useQuery(
    "search",
    searchLiked,
    {
      enabled: searchTerm.length > 0,
    }
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
          if (allTabs.length > 0) {
            allTabs.map(async (tab) => {
              if (tab.id)
                await browser.tabs.sendMessage(tab.id, { message: "UNLIKE" });
            });
          }
          refetch();
        }
      });
  };

  useEffect(() => {
    if (!isLoading && status == "success") {
      if (pages.current > 0) {
        setLiked((prev) => [...prev, ...data.likes]);
      } else setLiked(data.likes);
    }
  }, [data]);

  useEffect(() => {
    let timeout: number;
    if (searchTerm.length > 0) {
      timeout = setTimeout(() => {
        refetch();
      }, 500);
    }
    pages.current = 0;
    return () => {
      clearTimeout(timeout);
    };
  }, [searchTerm]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <div className="flex">
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
          <div className="flex w-full justify-between">
            <p>Search For Files</p>
          </div>
        </div>
      </div>
      <div className="mt-2 bg-lightInset dark:bg-darkInset p-3 rounded-xl">
        <div className="relative mb-3">
          <input
            value={searchTerm}
            onChange={handleSearch}
            className="py-1 pl-3 pr-5 rounded-md text-black w-full"
            placeholder="Search for liked files"
          />
          <img
            className="absolute right-3 top-0 translate-y-1/2"
            src="./assets/light/searching-black.svg"
          />
        </div>
        {isLoading || isFetching ? (
          <Spinner />
        ) : liked.length > 0 ? (
          <>
            {liked.map(({ fileName, url, repoName, branch, filePath }) => (
              <Card
                handleDelete={handleDelete}
                url={url}
                fileName={fileName}
                repo={repoName}
                branch={branch}
                location={filePath}
              />
            ))}
            {pages.current < data.totalPages - 1 && (
              <button
                onClick={() => nextPage()}
                className="w-full text-center py-1 bg-lightCard dark:bg-darkCard rounded-md"
              >
                More
              </button>
            )}
          </>
        ) : (
          <p className="text-center mt-4 p-3">No matching files found</p>
        )}
      </div>
    </div>
  );
};

export default index;
