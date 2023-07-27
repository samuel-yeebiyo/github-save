import SpinnerWhite from "../../assets/spinner-white.svg";
import SpinnerBlack from "../../assets/spinner-black.svg";
import { useTheme } from "../../context/themeContext";

const index = () => {
  const theme = useTheme();
  return (
    <div className="w-full flex items-center justify-center">
      <img
        className="animate-spin"
        src={theme.dark ? SpinnerWhite : SpinnerBlack}
      ></img>
    </div>
  );
};

export default index;
