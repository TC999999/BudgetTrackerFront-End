type budgetOperation = "Created" | "Edited" | "Deleted" | "-";

// helper function that returns a tailwindcss text color class for transaction list for when
// changes in a budget's value causes changes to a user's total savings, depending on what
// CRUD action was performed on a budget
export const returnBudgetColor = (budgetOperation: budgetOperation) => {
  let returnColor: string;
  switch (budgetOperation) {
    case "Created":
      returnColor = "text-emerald-700";
      break;
    case "Edited":
      returnColor = "text-orange-700";
      break;
    case "Deleted":
      returnColor = "text-red-600";
      break;
    default:
      returnColor = "text-black";
      break;
  }
  return returnColor;
};
