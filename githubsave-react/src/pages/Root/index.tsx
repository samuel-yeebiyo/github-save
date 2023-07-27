import { useEffect, useState } from "react";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import { useThemeDispatch, useTheme } from "../../context/themeContext";
import { ScrollRestoration } from "react-router-dom";

const Root = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, _] = useState(location.state);
  const theme = useTheme();
  const dispatch = useThemeDispatch();

  useEffect(() => {
    navigate("/home", {
      state: {
        likes: user.likes,
      },
    });
    console.log(user);
  }, []);
  // const handleDeauth = async () => {
  //   const deauthenticating = new Promise((resolve, reject) => {
  //     browser.runtime
  //       .sendMessage(undefined, {
  //         context: "DEAUTH",
  //       })
  //       .then((response): any => {
  //         resolve(response);
  //         if (!response) {
  //           reject();
  //         }
  //       });
  //   });
  //   const deauthed = await deauthenticating.then((res) => res);
  //   if (deauthed) {
  //     window.location.reload();
  //   }
  // };

  return (
    <div
      className={`${
        theme.dark ? "dark text-white bg-darkBg" : "text-black bg-lightBg"
      } relative w-full p-4 font-monaSans`}
    >
      <div className="flex justify-between mb-3">
        <p className="font-bold text-lg"> Github Save</p>
        <div className="flex gap-3 items-center">
          {theme.dark ? (
            <img
              onClick={() => dispatch({ dark: !theme.dark })}
              src="./assets/dark.svg"
              alt="toggle"
              className="h-6 cursor-pointer"
            />
          ) : (
            <img
              onClick={() => dispatch({ dark: !theme.dark })}
              src="./assets/light.svg"
              alt="toggle"
              className="h-6 cursor-pointer"
            />
          )}
          <img
            className="rounded-full border border-white w-8 h-8"
            src={user.avatar}
            alt="user-avatar"
          />
        </div>
      </div>
      <Outlet />
      <ScrollRestoration />
    </div>
  );
};

export default Root;
