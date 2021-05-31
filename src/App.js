import './App.css';
import { Person } from './Person';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {
          <h1>Cadastro de pessoas</h1>
        }
      </header>
      <Person/>
    </div>
  );
}

export default App;
