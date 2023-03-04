import React from 'react';
import logo from './logo.svg';
import './App.css';

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
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p>
          {!data ? 'Loading...' : data}
        </p>
        <DB />
      </header>
    </div>
  );
}

export default App;
