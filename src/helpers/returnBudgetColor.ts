type budgetOperation = "Created" | "Edited" | "Deleted" | "-";

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
