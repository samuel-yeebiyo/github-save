import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/themeContext";

const index = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <div className=" rounded-xl py-9 px-6 flex flex-col gap-4 bg-lightInset dark:bg-darkInset justify-center text-lg">
      <div
        className="flex gap-2 p-2 w-full hover:bg-lightCard dark:hover:bg-darkCard px-10 py-2 rounded-md cursor-pointer"
        onClick={() => navigate("/saved")}
      >
        {theme.dark ? (
          <img src="./assets/dark/file-white.svg" />
        ) : (
          <img src="./assets/light/file-black.svg" />
        )}
        <p>All saved file</p>
      </div>
      <div
        className="flex gap-2 p-2 w-full hover:bg-lightCard dark:hover:bg-darkCard px-10 py-2 rounded-md cursor-pointer"
        onClick={() => navigate("/repos")}
      >
        {theme.dark ? (
          <img src="./assets/dark/repo-white.svg" />
        ) : (
          <img src="./assets/light/repo-black.svg" />
        )}
        <p>Sorted by repository</p>
      </div>
      <div
        className="flex gap-2 p-2 w-full hover:bg-lightCard dark:hover:bg-darkCard px-10 py-2 rounded-md cursor-pointer"
        onClick={() => navigate("/search")}
      >
        {theme.dark ? (
          <img src="./assets/dark/search-white.svg" />
        ) : (
          <img src="./assets/light/search-black.svg" />
        )}
        <p>Search through files</p>
      </div>
    </div>
  );
};

export default index;
