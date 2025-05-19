import { Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes";
import ErrorRouter from "./ErrorRouter";
import NotLoggedInRoutes from "./NotLoggedInRoutes";
import NotFound from "./NotFound";
import Error from "./Error";
import HomePage from "./users/HomePage";
import EditUserForm from "./users/EditUserForm";
import TransactionHistory from "./transactions/TransactionHistory";
import BudgetPage from "./budgets/BudgetPage";
import SingleBudgetPage from "./budgets/SingleBudgetPage";
import IncomePage from "./incomes/IncomePage";
import SignUp from "./auth/SignUp";
import ResetPassword from "./auth/ResetPassword";
import { useAppSelector } from "./features/hooks";
import { UserContextInterface } from "./interfaces/userInterfaces";
import { shallowEqual } from "react-redux";
import { AnimatePresence } from "motion/react";

// main frontend route list for application
const RoutesList = (): JSX.Element | null => {
  const location = useLocation();
  const { loading }: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo,
    shallowEqual
  );
  return !loading ? (
    <AnimatePresence mode="wait">
      <Routes key={location.pathname} location={location}>
        <Route path="/" element={<HomePage />} />
        <Route element={<NotLoggedInRoutes />}>
          <Route path="/register" element={<SignUp />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
        </Route>
        <Route element={<ProtectedRoutes />}>
          <Route path="/user/:id/edit" element={<EditUserForm />} />
          <Route
            path="/transactions/user/:id"
            element={<TransactionHistory />}
          />
          <Route path="/incomes/user/:id" element={<IncomePage />} />
          <Route path="/budgets">
            <Route path="user/:id" element={<BudgetPage />} />
            <Route path=":budgetID/user/:id" element={<SingleBudgetPage />} />
          </Route>
          <Route element={<ErrorRouter />}>
            <Route path="/error" element={<Error />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  ) : null;
};

export default RoutesList;
