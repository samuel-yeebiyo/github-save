import { useEffect, useState } from "react";
import { useLocation, Outlet, useNavigate } from "react-router-dom";

const Root = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, _] = useState(location.state);

  useEffect(() => {
    navigate("/home");
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
    <div>
      <div className="flex justify-between mb-3">
        <p className="font-bold font-monaSans text-lg"> Github Save</p>
        <div className="flex">
          <img
            className="rounded-full border border-white w-4"
            src={user.avatar}
            alt="user-avatar"
          />
          <img
            className="rounded-full border border-white w-4"
            src={user.avatar}
            alt="user-avatar"
          />
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default Root;
