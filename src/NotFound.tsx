// Error page for 404 errors (invalid URL routes)
const NotFound = (): JSX.Element => {
  return (
    <div className="not-found-page text-center p-2">
      <h1 className="text-9xl text-emerald-900 underline">404 ERROR</h1>
      <h1 className="text-6xl p-2">
        The Page you were trying to look for does not exist!
      </h1>
    </div>
  );
};

export default NotFound;
