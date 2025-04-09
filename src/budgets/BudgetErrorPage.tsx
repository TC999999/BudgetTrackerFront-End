// returns unauthorized error page if user inputs a url to find a budget that
// either does not belong them or does not exist
const BudgetErrorPage = (): JSX.Element => {
  return (
    <div className="budget-error-page text-center p-2">
      <h1 className="text-9xl text-emerald-900 underline">401 ERROR</h1>
      <div className="error-list p-2">
        <h1 className="text-5xl">The budget you were trying to find either:</h1>
        <ul className="text-4xl">
          <li>Does not exist</li>
          <li>Does not belong to you</li>
        </ul>
      </div>
    </div>
  );
};

export default BudgetErrorPage;
