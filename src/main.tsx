import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Game } from './Game';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <main className="app">
      <h1>Rock Paper Scissors</h1>
      <Game />
    </main>
  </StrictMode>,
);
