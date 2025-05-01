import RoutesList from "./RoutesList";
import LoadingMsg from "./LoadingUserMsg";
import SmallLoadingMsg from "./SmallLoadingMsg";
import Navbar from "./Navbar";
import { ToastContainer } from "react-toastify";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useApp from "./hooks/useApp";

//renders whole application
function App(): JSX.Element {
  useApp();

  // returns loading messages, toast notifications, navbar, and routes list
  return (
    <div className="App">
      <SkeletonTheme
        enableAnimation
        baseColor="#646665"
        highlightColor="#f0f0f0"
        borderRadius={50}
      >
        <LoadingMsg />
        <SmallLoadingMsg />
        <ToastContainer position="bottom-right" />
        <Navbar />
        <RoutesList />
      </SkeletonTheme>
    </div>
  );
}

export default App;
