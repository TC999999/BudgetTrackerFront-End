import { useState, useCallback } from "react";
import { useNavigate, NavigateFunction } from "react-router-dom";
import { useAppDispatch } from "./../features/hooks";
import { AppDispatch } from "./../features/store";
import { logOutUser } from "./../features/actions/auth";

// custom hook for navbar functions: includes showing or hiding prompt asking if a user really wants to log out,
// logging out fully, and navigating to a specific url
const useNavbar = () => {
  const [showPrompt, setShowPrompt] = useState<boolean>(false);
  const dispatch: AppDispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();

  // hides prompt window asking user if they are sure if they want to logout
  const changePromptState = useCallback(
    (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      state: boolean = false
    ): void => {
      e.preventDefault();
      setShowPrompt(state);
    },
    [showPrompt]
  );

  // removes the user token from cookies and navigates back to log in page
  const logOutAndNavigate = useCallback(async (): Promise<void> => {
    try {
      navigate("/");
      await dispatch(logOutUser({})).unwrap();
      setShowPrompt(false);
    } catch (err) {
      console.log(err);
    }
  }, [showPrompt]);

  // navigates to page routed to url in parameters
  const goToURL = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, url: string): void => {
      e.preventDefault();
      navigate(url);
    },
    []
  );

  return { showPrompt, goToURL, changePromptState, logOutAndNavigate };
};

export default useNavbar;
