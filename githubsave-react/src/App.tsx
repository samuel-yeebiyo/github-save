import "./App.css";
import { Spinner } from "./components";

import { useState, useEffect } from "react";
import browser from "webextension-polyfill";
import { useQuery } from "react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTheme } from "./context/themeContext";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [authResponse, setAuthResponse] = useState<any>();
  const navigate = useNavigate();
  const theme = useTheme();

  // // function to make request to server for user session.
  const checkWithServer = async () => {
    const response = await axios
      .get("https://api.githubsave.samuelyyy.com/user", {
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

    return response;
  };

  const { isLoading, error, data, status } = useQuery(
    "checkWithServer",
    checkWithServer,
    {
      retry: 0,
    }
  );

  const handleAuth = async () => {
    const authenticating = new Promise((resolve, reject) => {
      browser.runtime
        .sendMessage(undefined, {
          context: "AUTH",
        })
        .then((response): any => {
          console.log(response);
          resolve(response.authed);
          if (!response) {
            reject();
          }
        });
    });

    const authed = await authenticating.then((liked) => liked);
    if (authed) {
      window.location.reload();
    } else {
      console.log("authentication failed");
    }
  };

  useEffect(() => {
    if (error) {
      setAuthenticated(false);
    }
  }, [error]);

  useEffect(() => {
    if (status == "success") {
      console.log({ authResponse });
      navigate("/", {
        state: data,
      });
      setAuthenticated(true);
      setAuthResponse(data);
    } else {
      setAuthenticated(false);
    }
  }, [data, status]);

  return (
    <div
      className={`${
        theme.dark ? "dark text-white bg-darkBg" : "text-black bg-lightBg"
      } relative w-full p-4 font-monaSans`}
    >
      <p className="font-bold"> Github Save</p>

      {isLoading ? (
        <Spinner />
      ) : (
        !authenticated && (
          <>
            <p className="my-2">
              Please authenticate using your GitHub account to start saving repo
              files.
            </p>
            <button
              className={` rounded-md py-1 px-2 ${
                theme.dark ? "!text-black bg-lightBg" : "text-white bg-darkBg"
              }`}
              onClick={handleAuth}
            >
              Authorize
            </button>
          </>
        )
      )}
    </div>
  );
}

export default App;
