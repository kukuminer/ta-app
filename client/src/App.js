import React from 'react';
import './App.css';
import { Outlet, Link } from "react-router-dom";

class DB extends React.Component {
  makeConnection() {
    fetch('/db')
      .then((res) => res.json())
      .then((data) => console.log(data));
  }



  ping() {
    fetch('/api')
      .then((res) => res.json())
      .then((data) => console.log(data));
  }

  render() {
    return (
      <div id='db'>
        <button onClick={() => this.makeConnection()}>Establish Connection</button>
        <button onClick={() => this.ping()}>Ping</button>
      </div>
    );
  }
}

const Nav = () => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Index</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </>

  )
}

function App() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch('/api')
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          {!data ? 'Loading...' : data}
        </p>
        <DB />
        <Nav />
      </header>
    </div>
  );
}

export default App;
