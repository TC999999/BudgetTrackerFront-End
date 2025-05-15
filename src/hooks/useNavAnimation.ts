import { useState } from "react";

type animationID =
  | "additional-nav-header-relative"
  | "additional-nav-header-sticky";

const useNavAnimation = () => {
  const [aniID, setAniID] = useState<animationID>(
    "additional-nav-header-relative"
  );

  const handleEntranceAnimationEnd = () => {
    setAniID("additional-nav-header-sticky");
  };

  return { aniID, handleEntranceAnimationEnd };
};

export default useNavAnimation;
