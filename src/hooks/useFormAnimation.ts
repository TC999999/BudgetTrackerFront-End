import { useCallback, useState } from "react";

type animationClass = "animate-form-fade-in" | "animate-form-fade-out";

type setter = (
  e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent
) => void;

const useFormAnimation = (setter: setter) => {
  const [animationClass, setAnimationClass] = useState<animationClass>(
    "animate-form-fade-in"
  );

  const changeAnimationClass = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent) => {
      e.preventDefault();
      setTimeout(() => {
        setter(e);
      }, 190);
      setAnimationClass("animate-form-fade-out");
    },
    [animationClass]
  );

  return { animationClass, changeAnimationClass };
};

export default useFormAnimation;
