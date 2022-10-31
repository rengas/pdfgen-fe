import { BrowserRouter as Router } from "react-router-dom";

import Shell from './components/Shell/Shell';
import { AppProvider } from './contexts/app.context';
import './App.css';

function App() {
  return (
    <div className="app">
      <AppProvider>
        <Router>
          <Shell />
        </Router>
      </AppProvider>
    </div>
  )
}

export default App;
