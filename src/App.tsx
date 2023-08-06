import "./App.css";
import { Spinner } from "./components";

import { useState, useEffect } from "react";
import browser from "webextension-polyfill";
import { useQuery } from "react-query";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "./context/themeContext";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [authentication, setAuthentication] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
    setAuthentication((prev) => !prev);
    setErrorMessage("");
    const authenticating = new Promise((resolve, reject) => {
      browser.runtime
        .sendMessage(undefined, {
          context: "AUTH",
        })
        .then((response): any => {
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
      setErrorMessage(
        "Failed to authenticate with server. Please try again later."
      );
      setAuthentication((prev) => !prev);
    }
  };

  useEffect(() => {
    if (location.state == "exit") {
      window.history.replaceState({}, document.title);
      window.location.reload();
    }
  }, [location.state]);

  useEffect(() => {
    if (error) {
      setAuthenticated(false);
    }
  }, [error]);

  useEffect(() => {
    if (status == "success" && data) {
      navigate("/", {
        state: data,
      });
      setAuthenticated(true);
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

      {isLoading || authentication ? (
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
                theme.dark
                  ? "!text-black bg-lightBg hover:bg-lightInset"
                  : "text-white bg-darkBg hover:bg-darkInset"
              }`}
              onClick={handleAuth}
            >
              Authorize
            </button>
            {errorMessage.length > 0 && (
              <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
            )}
          </>
        )
      )}
    </div>
  );
}

export default App;
