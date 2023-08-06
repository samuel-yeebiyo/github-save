interface ICard {
  fileName: string;
  repo: string;
  branch: string;
  location: string;
  url: string;
  handleDelete: (url: string) => void;
}

const index = ({
  fileName,
  repo,
  branch,
  location,
  handleDelete,
  url,
}: ICard) => {
  return (
    <div className="p-3 flex justify-between items-center bg-lightCard dark:bg-darkCard mb-2 rounded-md shadow-lg">
      <div>
        <a className="mb-1 block hover:underline" href={url} target="_blank">
          {fileName}
        </a>
        <div className="text-xs flex flex-col gap-1 text-fadedWhite">
          <div className="flex gap-1">
            <img width="16" src="./assets/repo-gray.svg" />
            <p>{repo}</p>
          </div>
          <div className="flex gap-1">
            <img width="16" src="./assets/branch-gray.svg" />
            <p>{branch}</p>
          </div>
          <div className="flex gap-1">
            <img width="16" src="./assets/pin-gray.svg" />
            <p>{location}</p>
          </div>
        </div>
      </div>
      <div>
        <img
          onClick={() => handleDelete(url)}
          className="dark:block hidden cursor-pointer"
          width="20"
          src="./assets/dark/close-white.svg"
        />
        <img
          onClick={() => handleDelete(url)}
          className="dark:hidden block cursor-pointer"
          width="20"
          src="./assets/light/close-black.svg"
        />
      </div>
    </div>
  );
};

export default index;
