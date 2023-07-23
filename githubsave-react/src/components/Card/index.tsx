interface ICard {
  fileName: string;
  repo: string;
  branch: string;
  location: string;
}

const index = ({ fileName, repo, branch, location }: ICard) => {
  return (
    <div className="p-3 flex justify-between items-center bg-darkCard mb-2 rounded-md">
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
        <img width="20" src="./assets/dark/close-white.svg" />
      </div>
    </div>
  );
};

export default index;
