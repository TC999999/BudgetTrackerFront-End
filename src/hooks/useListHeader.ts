import { useMemo } from "react";
import { ListHeaderType } from "../interfaces/miscTypes";

// custom hook for list headers strings: includes the title, noting the max length of the list, and the
// message describing the list
const useListHeader = ({ type, itemListLength }: ListHeaderType) => {
  // returns the title for the list depending on the type in props
  const constructTitle: string = useMemo(() => {
    const makeTitle = (): string => {
      switch (type) {
        case "Incomes":
          return "All Current Incomes";
        case "Budgets":
          return "All Current Budgets";
        case "Savings":
          return "Full Savings Changes History";
        case "Recent Savings":
          return "Recent Changes to Savings";
        case "Expenses":
          return "Expenses Made";
        case "Recent Expenses":
          return "Recent Budget Expenses";
      }
    };
    return makeTitle();
  }, [type]);

  // returns the number of items in the list depending on the type in props
  const maxListLength: string = useMemo(() => {
    const getMaxLength = (): string => {
      switch (type) {
        case "Incomes":
          return `(${itemListLength}/3)`;
        case "Budgets":
          return `(${itemListLength}/10)`;
        default:
          return "";
      }
    };
    return getMaxLength();
  }, [type, itemListLength]);

  // returns a description of the list depending on the type in props
  const getMessage: string = useMemo(() => {
    const returnMessage = (): string => {
      switch (type) {
        case "Incomes":
          return "Here you may add, update, or delete any sources of income you may have. Each of below income values will be added to your total savings automatically on the time noted on 'Next Received On'. You are allowed a maximum of three incomes";
        case "Budgets":
          return "Here you may set aside funds in order to make plans for future budgets or record current budgets you may have. You are allowed a maximum of ten budgets.";
        case "Savings":
          return "Here are all changes to your savings, which include direct transactions, receieved incomes, and any budget creation/edit/deletion. They cannot be edited or deleted. They may include budgets and incomes that you do not recieve anymore.";
        case "Recent Savings":
          return "Below are your most recent changes to your savings (≤5), which includes direct transactions, receieved incomes, and any budget creations/edits/deletions.";
        case "Expenses":
          return "Below are all expenses made using funds from this budget. The total added value of all below expenses should not exceed the total funds allocated for this budget.";
        case "Recent Expenses":
          return " Below are your most recent budget expenses (≤5). These only include expenses made using funds from all budgets you have presently.";
      }
    };
    return returnMessage();
  }, [type]);

  return {
    constructTitle,
    maxListLength,
    getMessage,
  };
};

export default useListHeader;
