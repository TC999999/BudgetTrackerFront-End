# Budget Planner - Frontend

## Application Link

_to be added later_

## Backend Service

[Click Here](https://github.com/TC999999/BudgetTrackerBack-End) to see backend service.

## Application Stack

This application was made using the MERN stack.

- MongoDB
- Express.js
- React.js
- Node.js

With the front-end using React.js, Typescript, and Redux

## Application Details

This app is designed for users to efficiently create, track, or plan for their budgetary needs. It promotes financial security by ensuring that users never go over budget when documenting expenses or allocate more funds than they can to those budgets.

When a user registers to our service, they also input their current total savings/assets value and any incomes they may have. After their accounts are created, users will also be able to adjust their savings value manually if they need to.

Users will also be able to add any incomes they may have when signing up or when logged in. These incomes will be added to a cron schedule on the backend, and each user will have their own unique event source to listen for server-side events that will update that particular income on the frontend in real time. The user's total savings value will also increase by the salary value recorded in the job in real time. For the purposes of saving data, users will only be allowed to have a maximum of five incomes at a time. Deleting an income will also remove it from the backend schedule.

Users can create budgets by allocating funds from their savings; they will be able to add to or subtract from those funds later, with the difference coming out of or into total savings. Users will be shown how much money has been spent using funds from each budget as well as the amount remaining. Users will be able to document expenses/transactions made using funds from their budgets. Expenses are sorted by the date listed in the database. Users will not be allowed to make transactions/expenses if they have spent all of the allocated funds for that budget or if they are attempting to document an expense that goes over budget. Deleting a budget will also delete all expenses made using that budget; users will also be given the option to return funds from that budget back to savings. The dashboard page will include a list of the user's ten most recent expenses, listing when they were made and which budget they were used with.
