import { BrowserRouter as Router } from "react-router-dom";

import Shell from './components/Shell/Shell';
import './App.css';

function App() {
  return (
    <div className="app">
      <Router>
        <Shell />
      </Router>
    </div>
  )
}

export default App;
