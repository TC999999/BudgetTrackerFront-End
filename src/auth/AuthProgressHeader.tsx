import { CiCircleCheck } from "react-icons/ci";

type Props = {
  place: "beginning" | "middle" | "end";
  current: boolean;
  done: boolean;
  label: string;
};

// reusable multipart form header component
const AuthProgressHeader: React.FC<Props> = ({
  place,
  current,
  done,
  label,
}) => {
  const borderHandle = (): string => {
    let borderClass: string;
    switch (place) {
      case "beginning":
        borderClass = "rounded-l-sm border-r-2";
        break;
      case "middle":
        borderClass = "border-r-2";
        break;
      case "end":
        borderClass = "rounded-r-sm";
    }
    return borderClass;
  };

  return (
    <div
      title="auth-progress-header"
      className={`pt-2 pb-8 text-xs sm:text-base flex justify-center items-center ${borderHandle()} ${
        current ? "underline text-green-500 bg-green-100" : ""
      } ${done ? "text-green-700 bg-green-500" : ""}`}
    >
      <p>{label}</p>
      <CiCircleCheck className="text-xl" />
    </div>
  );
};

export default AuthProgressHeader;
