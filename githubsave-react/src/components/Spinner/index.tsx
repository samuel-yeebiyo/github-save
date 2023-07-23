import Spinner from "../../assets/spinner.svg";

const index = () => {
  return (
    <div className="w-full flex items-center justify-center">
      <img className="animate-spin" src={Spinner}></img>
    </div>
  );
};

export default index;
