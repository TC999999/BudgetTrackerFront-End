import { useState, SyntheticEvent } from "react";
import { Tab, Box } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { RecentExpense } from "../interfaces/expenseInterfaces";
import { Transaction } from "../interfaces/transactionInterfaces";
import TransactionList from "../transactions/transactionList";
import ExpenseList from "../expenses/ExpenseList";
import ListHeader from "../ListHeader";

type Props = {
  expenses: RecentExpense[];
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
              label="Recent Savings Changes"
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
            <ListHeader type="Recent Savings" />
            <TransactionList transactions={transactions} />
          </section>
        </TabPanel>
        <TabPanel value="2">
          <section
            id="recent-expenses-list"
            className="transition duration-150"
          >
            <ListHeader type="Recent Expenses" />
            <ExpenseList expensesList={expenses} isFrontPage={true} />
          </section>
        </TabPanel>
      </TabContext>
    </div>
  );
};

export default Recents;
