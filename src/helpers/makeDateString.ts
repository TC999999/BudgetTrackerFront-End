const monthes = new Map<number, string>([
  [0, "Jan."],
  [1, "Feb."],
  [2, "Mar."],
  [3, "Apr."],
  [4, "May"],
  [5, "Jun."],
  [6, "Jul."],
  [7, "August"],
  [8, "Sep."],
  [9, "Oct."],
  [10, "Nov."],
  [11, "Dec."],
]);

export const makeDateString = (dateString: string): string => {
  let date = new Date(dateString);
  let m: number = date.getMonth();
  let month: string = monthes.get(m)!;
  let day: number = date.getDate();
  let year: number = date.getFullYear();
  return `${month} ${day}, ${year}`;
};
