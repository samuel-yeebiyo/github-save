import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { RecentlySaved, Menu } from "../../components";

const Home = () => {
  const location = useLocation();
  const [sorted, setSortedLiked] = useState([]);

  useEffect(() => {
    const sorted = location.state.likes
      .sort((a: any, b: any) => a.createdAt - b.createdAt)
      .reverse();
    setSortedLiked(sorted);
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
      <RecentlySaved liked={sorted} />
      {/* Menu */}
      <Menu />
    </div>
  );
};

export default Home;
