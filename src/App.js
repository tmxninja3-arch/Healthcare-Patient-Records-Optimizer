import React from 'react';
import Dashboard from './pages/Dashboard';
import './App.css';

// App.js is the root component
// It simply renders the Dashboard page
function App() {
  return (
    <div className="app">
      <Dashboard />
    </div>
  );
}

export default App;