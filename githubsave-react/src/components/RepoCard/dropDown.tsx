import { useEffect, useState } from "react";
import { useTheme } from "../../context/themeContext";

interface IDropDown {
  files: any[];
}

interface IOrganized {
  [key: string]: any[];
}

const DropDown = ({ files }: IDropDown) => {
  const [organizedFiles, setOrganizedFiles] = useState<IOrganized>({});
  const theme = useTheme();

  useEffect(() => {
    let data: any = {};

    files.map((file) => {
      if (Object.keys(data).includes(file.branch)) {
        data[file.branch].push(file);
      } else {
        data = { ...data, [file.branch]: [file] };
      }
    });

    console.log({ data });
    setOrganizedFiles(data);
  }, []);

  return (
    <div className="p-2">
      {Object.keys(organizedFiles).length > 0 &&
        Object.entries(organizedFiles).map(([key, value]) => (
          <div className="mb-3">
            <div className="flex gap-1 mb-2">
              {theme.dark ? (
                <img className="w-4" src="./assets/dark/branch-white.svg" />
              ) : (
                <img className="w-4" src="./assets/light/branch-black.svg" />
              )}
              <p>{key}</p>
            </div>
            {value.map((file) => (
              <div className="pl-5 text-left py-2 bg-lightCard dark:bg-darkCard mb-1">
                <a href={file.url} target="_blank">
                  /{file.filePath}
                </a>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
};

export default DropDown;
