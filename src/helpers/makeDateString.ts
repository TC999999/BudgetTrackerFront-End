const monthes = new Map<number, string>([
  [0, "January"],
  [1, "February"],
  [2, "March"],
  [3, "April"],
  [4, "May"],
  [5, "June"],
  [6, "July"],
  [7, "August"],
  [8, "September"],
  [9, "October"],
  [10, "November"],
  [11, "December"],
]);

export const makeDateString = (date: Date): string => {
  let m: number = date.getMonth();
  let month: string = monthes.get(m)!;
  let day: number = date.getDate();
  let year: number = date.getFullYear();
  return `${month} ${day}, ${year}`;
};
