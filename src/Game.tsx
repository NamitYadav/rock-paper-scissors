import { useEffect, useReducer, useRef, useState } from 'react';
import { load, randomWeapon, reducer, save, WEAPONS, type Mode, type Weapon } from './rules';

const ICON: Record<Weapon, string> = { rock: '✊', paper: '✋', scissors: '✌️' };
const NAMES: Record<Mode, [string, string]> = {
  player: ['You', 'Computer'],
  computer: ['Computer 1', 'Computer 2'],
};
const FRAMES = 6;
const FRAME_MS = 100;

export function Game() {
  const [state, dispatch] = useReducer(reducer, undefined, load);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<number>(undefined);

  useEffect(() => save(state), [state]);
  useEffect(() => () => window.clearInterval(timer.current), []);

  const play = () => {
    setPlaying(true);
    let frame = 0;
    timer.current = window.setInterval(() => {
      dispatch({ type: 'shuffle', one: randomWeapon(), two: randomWeapon() });
      if (++frame < FRAMES) return;
      window.clearInterval(timer.current);
      dispatch({ type: 'settle' });
      setPlaying(false);
    }, FRAME_MS);
  };

  const [nameOne, nameTwo] = NAMES[state.mode];
  const winner = state.result === 'one' ? nameOne : nameTwo;
  const verdict =
    state.result === 'tie' ? "It's a tie!" : state.result && `${winner} ${winner === 'You' ? 'win' : 'wins'}!`;

  return (
    <div className="game">
      <div className="game-top">
        <fieldset disabled={playing}>
          <legend>Game type</legend>
          {(['player', 'computer'] as const).map((mode) => (
            <label key={mode}>
              <input
                type="radio"
                name="mode"
                checked={state.mode === mode}
                onChange={() => dispatch({ type: 'mode', mode })}
              />{' '}
              {mode === 'player' ? 'Player vs Computer' : 'Computer vs Computer'}
            </label>
          ))}
        </fieldset>
        <fieldset>
          <legend>Score</legend>
          <div>{nameOne}: {state.score.one}</div>
          <div>{nameTwo}: {state.score.two}</div>
        </fieldset>
      </div>

      <div className="players">
        <div className="player">
          <h2>{nameOne}</h2>
          <span className="icon mirrored" role="img" aria-label={state.one}>{ICON[state.one]}</span>
          {state.mode === 'player' && (
            <div className="weapons">
              {WEAPONS.map((weapon) => (
                <button
                  key={weapon}
                  type="button"
                  aria-pressed={state.one === weapon}
                  disabled={playing}
                  onClick={() => dispatch({ type: 'pick', weapon })}
                >
                  {ICON[weapon]} {weapon}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="player">
          <h2>{nameTwo}</h2>
          <span className="icon" role="img" aria-label={state.two}>{ICON[state.two]}</span>
        </div>
      </div>

      <div className="actions">
        <button type="button" className="start" disabled={playing} onClick={play}>Start</button>
        <button type="button" className="reset" disabled={playing} onClick={() => dispatch({ type: 'reset' })}>Reset</button>
      </div>
      <p className="verdict" aria-live="polite">{verdict}</p>
    </div>
  );
}
