import { useState } from "react";

import DropDown from "./dropDown";

interface ICard {
  repo: string;
  image: string;
  files: any[];
}

const index = ({ repo, image, files }: ICard) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="bg-lightInset dark:bg-darkInset shadow-lg mb-4">
      <div className="h-[160px] overflow-hidden">
        <img
          className="object-cover"
          src={image || "./assets/github-repo.png"}
          alt="repoooooo image"
        />
      </div>
      {!image && <p className="text-xs">{repo}</p>}
      <div className="text-center  text-sm">
        <p
          className="cursor-pointer w-full py-2"
          onClick={() => setOpen(!open)}
        >
          You have {files.length} liked file(s)
        </p>
        {open && <DropDown files={files} />}
      </div>
    </div>
  );
};

export default index;
