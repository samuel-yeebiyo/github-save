import OfflineWhite from "../../assets/offline-white.svg";
import OfflineBlack from "../../assets/offline-black.svg";

import { useTheme } from "../../context/themeContext";

const index = () => {
  const theme = useTheme();
  return (
    <div className="flex flex-col p-5 items-center gap-3">
      <img className="h-7" src={theme.dark ? OfflineWhite : OfflineBlack} />
      <p className="text-xs">Oops! Technical glitch! We're on it!</p>
    </div>
  );
};

export default index;
