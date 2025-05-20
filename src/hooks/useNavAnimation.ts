import { useState } from "react";

type positionType = "relative" | "sticky";

const useNavAnimation = () => {
  const [positionType, setPositionType] = useState<positionType>("relative");

  const handleEntranceAnimationEnd = () => {
    setPositionType("sticky");
  };

  return { positionType, handleEntranceAnimationEnd };
};

export default useNavAnimation;
