const Forbidden = () => (
  <>
    <h1>403</h1>
    <p>
      {
        "Your session has timed out or your authorization is invalid. Please sign in again by going to "
      }
      <a href="https://ta-app.eecs.yorku.ca/">https://ta-app.eecs.yorku.ca/</a>
    </p>
  </>
);

export default Forbidden;
