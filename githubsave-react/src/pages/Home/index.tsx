import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { RecentlySaved, Menu } from "../../components";

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    console.log(location.state);
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
      {/* Recently saved */}
      <RecentlySaved />
      {/* Menu */}
      <Menu />
    </div>
  );
};

export default Home;
