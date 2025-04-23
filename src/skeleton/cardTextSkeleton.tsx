import { PropsWithChildren } from "react";

const CardTextSkeleton = ({ children }: PropsWithChildren<unknown>) => {
  //   return <div className="p-1 text-center content-center w-24">{children}</div>;
  return (
    <div className="p-1 text-sm sm:text-base flex justify-center">
      <div className="w-24"> {children}</div>
    </div>
  );
};

export default CardTextSkeleton;
