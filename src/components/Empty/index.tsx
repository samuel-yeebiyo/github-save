import { useTheme } from "../../context/themeContext";

import FolderWhite from "../../assets/folder-white.svg";
import FolderBlack from "../../assets/folder-black.svg";

const index = () => {
  const theme = useTheme();
  return (
    <div className="p-4 text-center flex flex-col gap-3 items-center">
      <img className="w-9" src={theme.dark ? FolderWhite : FolderBlack} />
      <p>No saved files</p>
    </div>
  );
};

export default index;
