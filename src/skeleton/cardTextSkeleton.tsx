import { PropsWithChildren } from "react";

// returns a single line of skeleton loader text for tables
const CardTextSkeleton = ({ children }: PropsWithChildren<unknown>) => {
  return (
    <div className="p-1 text-sm sm:text-base flex justify-center">
      <div className="w-24"> {children}</div>
    </div>
  );
};

export default CardTextSkeleton;
