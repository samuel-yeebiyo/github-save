interface ICard {
  fileName: string;
  repo: string;
  branch: string;
  location: string;
}

const index = ({ fileName, repo, branch, location }: ICard) => {
  return (
    <div className="p-3 flex justify-between items-center bg-lightCard dark:bg-darkCard mb-2 rounded-md shadow-lg">
      <div>
        <p className="mb-1">{fileName}</p>
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
          className="dark:block hidden"
          width="20"
          src="./assets/dark/close-white.svg"
        />
        <img
          className="dark:hidden block"
          width="20"
          src="./assets/light/close-black.svg"
        />
      </div>
    </div>
  );
};

export default index;
