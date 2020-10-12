import React from 'react';

import './App.css';
import Home from './components/home/home';
import Score from './components/score/score';

function App() {
  return (
    <div className='app'>
      <header className='app-header'>Rock Paper Scissors</header>
      <div className='app-content'>
        <Home />
        <Score />
      </div>
    </div>
  );
}

export default App;
