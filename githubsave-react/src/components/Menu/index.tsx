import { useNavigate } from "react-router-dom";

const index = () => {
  const navigate = useNavigate();

  return (
    <div className=" rounded-xl p-12 flex flex-col gap-4 bg-darkInset justify-center text-lg">
      <div
        className="flex gap-2 p-2 w-full hover:bg-darkCard"
        onClick={() => navigate("/saved")}
      >
        <img src="./assets/dark/file-white.svg" />
        <p>All saved file</p>
      </div>
      <div
        className="flex gap-2 p-2 w-full hover:bg-darkCard"
        onClick={() => navigate("/repos")}
      >
        <img src="./assets/dark/repo-white.svg" />
        <p>Sorted by repository</p>
      </div>
      <div
        className="flex gap-2 p-2 w-full hover:bg-darkCard"
        onClick={() => navigate("/saved")}
      >
        <img src="./assets/dark/search-white.svg" />
        <p>Search through files</p>
      </div>
    </div>
  );
};

export default index;
