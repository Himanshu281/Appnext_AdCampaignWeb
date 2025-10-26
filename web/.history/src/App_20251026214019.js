import './App.css';
import Campaigns from './Campaigns';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Ad Campaign Status Dashboard</h1>
        <p>Live status updates for campaigns. Change status using the dropdowns below.</p>
      </header>

      <main>
        <Campaigns />
      </main>
    </div>
  );
}

export default App;
