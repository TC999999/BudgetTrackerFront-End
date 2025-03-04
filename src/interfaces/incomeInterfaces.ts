export type UpdateTime = {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
};

export type Income = {
  _id: string;
  title: string;
  salary: string;
  readableUpdateTimeString: string;
  lastReceived: string;
  nextReceived: string;
};

export type NewIncome = {
  title: string;
  salary: number;
  updateTime: UpdateTime;
};

export type SubmitIncomeSignUp = {
  title: string;
  salary: number;
  cronString: string;
  readableUpdateTimeString: string;
};

export type deleteIncomeType = {
  id: string;
};

export type IncomeErrors = {
  title: string;
  salary: string;
};

export type FlashIncomeErrors = { title: boolean; salary: boolean };
