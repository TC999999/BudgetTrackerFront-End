import Skeleton from "react-loading-skeleton";

// Card for IncomePage.tsx, shows the title, salary, update interval, and when the next income update is
const IncomeSkeletonCard = (): JSX.Element => {
  return (
    <div className="flex justify-center">
      <div className="p-2 m-4 w-96 sm:w-2/3 text-center border-4 border-green-700 bg-white rounded-lg">
        <header>
          <h1 className="text-2xl sm:text-4xl text-green-600 underline">
            <Skeleton width={100} />
          </h1>
        </header>
        <div className="lg:flex lg:justify-evenly">
          <div className="salary-information flex justify-center items-center text-xl sm:text-3xl lg:m-4 lg:p-2  lg:w-96 lg:border-2 lg:border-green-700 lg:rounded-lg lg:shadow-lg">
            <div>
              <p className="underline">Salary: </p>
              <p className="salary-number-value font-bold">
                <Skeleton width={200} />
              </p>
              <p className="readable-salary-interval">
                <Skeleton width={200} />
              </p>
            </div>
          </div>
          <div className="next-and-last-received-dates flex justify-between items-center text-lg sm:text-2xl lg:m-4 lg:p-2 lg:border-2 lg:border-green-700 lg:rounded-lg lg:shadow-lg">
            <div className="last-received-date m-1">
              <p className="font-bold">Last Received: </p>
              <p>
                <Skeleton />
              </p>
            </div>
            <div className="next-received-date m-1">
              <p className="font-bold">Next Received: </p>
              <p>
                <Skeleton />
              </p>
            </div>
          </div>
        </div>
        {/* <div className="flex justify-around">
          <div>
            <Skeleton />
          </div>
          <div>
            <Skeleton />
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default IncomeSkeletonCard;
