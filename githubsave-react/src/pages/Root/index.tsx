import { useEffect, useState, useRef } from "react";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import { useThemeDispatch, useTheme } from "../../context/themeContext";
import { ScrollRestoration } from "react-router-dom";
import browser from "webextension-polyfill";
import { useClickOutside } from "../../hooks";
const Root = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, _] = useState(location.state);
  const theme = useTheme();
  const dispatch = useThemeDispatch();
  const [profileMenu, setProfileMenu] = useState(false);

  // Deletion process
  const [deletePrompt, setDeletePrompt] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [deleting, setDeleting] = useState(false);

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useClickOutside(wrapperRef, () => {
    setProfileMenu(false);
  });

  useEffect(() => {
    navigate("/home", {
      state: {
        likes: user.likes,
      },
    });
  }, []);

  const toggleProfileMenu = () => {
    setProfileMenu(!profileMenu);
  };

  const handleExit = async () => {
    setDeleting(true);
    const exiting = new Promise((resolve, reject) => {
      browser.runtime
        .sendMessage(undefined, {
          context: "EXIT",
        })
        .then((response): any => {
          resolve(response);
          if (!response) {
            reject();
          }
        });
    });
    const exited = await exiting.then((res) => res);
    setDeleting(false);
    if (exited) {
      navigate("/index.html", {
        state: "exit",
      });
    }
  };

  const handleDeauth = async () => {
    const deauthenticating = new Promise((resolve, reject) => {
      browser.runtime
        .sendMessage(undefined, {
          context: "DEAUTH",
        })
        .then((response): any => {
          resolve(response);
          if (!response) {
            reject();
          }
        });
    });
    const deauthed = await deauthenticating.then((res) => res);
    if (deauthed) {
      navigate("/index.html", {
        state: "exit",
      });
    }
  };

  return (
    <div
      className={`relative ${
        theme.dark ? "dark text-white bg-darkBg" : "text-black bg-lightBg"
      } w-full p-4 font-monaSans`}
    >
      <div className="flex justify-between mb-3">
        <p className="font-bold text-lg"> Github Save</p>
        <div className="flex gap-4 items-center">
          {theme.dark ? (
            <>
              <img
                onClick={() => dispatch({ dark: !theme.dark })}
                src="./assets/dark.svg"
                alt="toggle"
                className="h-4 cursor-pointer"
              />
            </>
          ) : (
            <>
              <img
                onClick={() => dispatch({ dark: !theme.dark })}
                src="./assets/light.svg"
                alt="toggle"
                className="h-4 cursor-pointer"
              />
            </>
          )}
          <div className="relative" ref={wrapperRef}>
            <img
              className="rounded-full border border-white w-8 h-8 cursor-pointer"
              src={user.avatar}
              alt="user-avatar"
              onClick={toggleProfileMenu}
            />
            {profileMenu && (
              <div className="absolute p-3 bg-gray-200 dark:bg-gray-950 left-0 -translate-x-[78%] rounded-sm shadow-xl bottom-0 translate-y-[105%]">
                <button
                  onClick={() => {
                    setProfileMenu(false);
                    handleDeauth();
                  }}
                  className="text-sm w-36 p-2 hover:bg-lightCard dark:hover:bg-darkCard"
                >
                  Sign out
                </button>
                <button
                  onClick={() => {
                    setProfileMenu(false);
                    setDeletePrompt(true);
                  }}
                  className="text-sm w-36 p-2 hover:bg-lightCard dark:hover:bg-darkCard"
                >
                  Delete account
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {deletePrompt && (
        <div
          className="absolute top-0 left-0 bg-black bg-opacity-30 w-full h-full flex items-center justify-center p-6"
          onClick={() => setDeletePrompt(false)}
        >
          <div
            className=" bg-lightBg dark:bg-darkBg p-3 text-sm shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <p>
              Are you sure you want to permanently delete your account? To
              confirm the deletion of your account, please type out the
              following:
            </p>
            <p className="mt-2 mb-1">{user.ex_id}</p>
            <input
              className="block text-black p-1 rounded-sm w-full"
              value={confirmation}
              onChange={(e) => {
                setConfirmation(e.target.value);
              }}
            />
            <button
              className="rounded-md mt-3 py-1 hover:bg-red-800 bg-red-700 text-white font-bold text-center w-full disabled:bg-gray-600 disabled:text-gray-500"
              disabled={!deleting && confirmation !== user.ex_id}
              onClick={() => handleExit()}
            >
              {deleting ? "Deleting..." : "Delete account"}
            </button>
          </div>
        </div>
      )}
      <Outlet />
      <ScrollRestoration />
    </div>
  );
};

export default Root;
