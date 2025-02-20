import { Routes, Route } from "react-router-dom";
import NotFound from "./NotFound";
import HomePage from "./users/HomePage";
import BudgetPage from "./budgets/BudgetPage";
import SingleBudgetPage from "./budgets/SingleBudgetPage";
import BudgetErrorPage from "./budgets/BudgetErrorPage";
import SignUp from "./auth/SignUp";
import ResetPassword from "./auth/ResetPassword";

const RoutesList = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<SignUp />} />
      <Route path="/resetPassword" element={<ResetPassword />} />
      <Route path="/budgets" element={<BudgetPage />} />
      <Route path="/budgets/:id" element={<SingleBudgetPage />} />
      <Route path="/budgets/error/unauthorized" element={<BudgetErrorPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default RoutesList;
