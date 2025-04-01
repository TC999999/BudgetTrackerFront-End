export type dateInfo = {
  date: string;
  time: string;
};

// takes dateTime string and converts it into and returns two separate strings for both the date
// and the time
export const makeDateString = (dateString: string): dateInfo => {
  // if(!dateString) return 'no data for this time'
  let d: Date = new Date(dateString);
  let date: string = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  let time: string = d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // return `${date} at ${time}`
  return {
    date,
    time,
  };
};

export const makeDateStringIncomeCard = (dateString: string): string => {
  if (!dateString) return "no data for this time";
  let d: Date = new Date(dateString);
  let date: string = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  let time: string = d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${date} at ${time}`;
};
