import { useState, SyntheticEvent } from "react";
import { Tab, Box } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { ExpenseInterface } from "../interfaces/expenseInterfaces";
import { Transaction } from "../interfaces/transactionInterfaces";
import TransactionList from "../transactions/TransactionList";
import ExpenseList from "../expenses/ExpenseList";

type Props = {
  expenses: ExpenseInterface[];
  transactions: Transaction[];
};

type tabState = "1" | "2";

// returns a tabbed list of recent transactions made directly from savings
// and expenses made using budget funds
const Recents: React.FC<Props> = ({ expenses, transactions }) => {
  const [val, setVal] = useState<tabState>("1");

  const changeTab = (
    e: SyntheticEvent<Element, Event>,
    val: tabState
  ): void => {
    e.preventDefault();
    setVal(val);
  };
  return (
    <div
      id="recent-data"
      className="border-2 border-green-500 m-4 rounded-lg bg-green-200"
    >
      <TabContext value={val}>
        <Box className="border-b-2 border-green-500 bg-green-300 rounded-t-lg">
          <TabList onChange={changeTab} allowScrollButtonsMobile centered>
            <Tab
              className="recent-transactions"
              label="Recent Misc. Transactions"
              value="1"
            />
            <Tab
              className="recent-transactions"
              label="Recent Budget Expenses"
              value="2"
            />
          </TabList>
        </Box>

        <TabPanel value="1">
          <section
            id="recent-transactions-list"
            className="transition duration-150"
          >
            <header className="text-center mb-2">
              <h2 id="recent-transactions-list-title" className="list-header">
                Recent Miscellaneous Transactions
              </h2>
              <small>
                Below are your most recent transactions (≤5), which includes
                both that you have documented yourself and from your incomes:
                past and present.
              </small>
            </header>
            <TransactionList transactions={transactions} />
          </section>
        </TabPanel>
        <TabPanel value="2">
          <section
            id="recent-expenses-list"
            className="transition duration-150"
          >
            <header className="text-center mb-2">
              <h2 id="recent-expenses-list-title" className="list-header">
                Recent Budget Expenses
              </h2>
              <small>
                Below are your most recent budget expenses (≤5). These only
                include expenses made using funds from all budgets you have
                presently.
              </small>
            </header>
            <ExpenseList expensesList={expenses} isFrontPage={true} />
          </section>
        </TabPanel>
      </TabContext>
    </div>
  );
};

export default Recents;
