import { useEffect, useEffectEvent, useReducer, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import {
  FIRST_TO, load, matchWinner, randomWeapon, reducer, roundWins, save, SIDES, WEAPONS,
  type Mode, type Round, type Side, type Weapon,
} from './rules';

const ICON: Record<Weapon, string> = { rock: '✊', paper: '✋', scissors: '✌️' };
const NAMES: Record<Mode, Record<Side, string>> = {
  player: { one: 'You', two: 'Computer' },
  computer: { one: 'Computer 1', two: 'Computer 2' },
};
const FRAMES = 6;
const FRAME_MS = 100;

type Throws = Pick<Round, 'one' | 'two'>;

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

// Agreement follows the side, not the display string: "You win", "Computer wins".
const wins = (mode: Mode, side: Side) => `${NAMES[mode][side]} ${mode === 'player' && side === 'one' ? 'win' : 'wins'}`;

function describe(mode: Mode, { one, two, result }: Round) {
  if (result === 'tie') return `Both threw ${one}. Tie.`;
  const [winner, loser] = result === 'one' ? [one, two] : [two, one];
  return `${capitalize(winner)} beats ${loser}. ${wins(mode, result)} the round.`;
}

// The emoji is decoration; screen readers get the name.
const Throw = ({ weapon }: { weapon: Weapon }) => (
  <>
    <span aria-hidden="true">{ICON[weapon]}</span> {capitalize(weapon)}
  </>
);

export function Game() {
  const [state, dispatch] = useReducer(reducer, undefined, load);
  const [frame, setFrame] = useState<Throws | null>(null);
  const timer = useRef<number>(undefined);
  const weapons = useRef<HTMLDivElement>(null);
  const newMatchButton = useRef<HTMLButtonElement>(null);

  const { mode, history } = state;
  const playing = frame !== null;
  const winner = matchWinner(history);
  const score = roundWins(history);
  const last = history.at(-1);
  const shown = frame ?? last;

  useEffect(() => save(state), [state]);
  useEffect(() => () => window.clearInterval(timer.current), []);

  const finish = (round: Throws) => {
    // Commit synchronously so that, if this round ended the match, New match exists to take focus.
    flushSync(() => {
      setFrame(null);
      dispatch({ type: 'play', ...round });
    });
    newMatchButton.current?.focus();
  };

  const play = (pick?: Weapon) => {
    if (playing || winner) return;
    const draw = () => ({ one: pick ?? randomWeapon(), two: randomWeapon() });
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return finish(draw());
    let frames = FRAMES;
    setFrame(draw());
    timer.current = window.setInterval(() => {
      if (--frames) {
        setFrame(draw());
      } else {
        window.clearInterval(timer.current);
        finish(draw());
      }
    }, FRAME_MS);
  };

  const newMatch = () => {
    dispatch({ type: 'newMatch' });
    // In Computer vs Computer this button turns back into Play round and keeps focus; in player mode it goes away.
    if (mode === 'player') weapons.current?.querySelector('button')?.focus();
  };

  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    const weapon = WEAPONS.find((w) => w[0] === event.key.toLowerCase());
    const modified = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
    const typing =
      event.target instanceof Element &&
      event.target.matches('input:not([type=radio]), textarea, select, [contenteditable]');
    if (weapon && mode === 'player' && !modified && !typing) play(weapon);
  });
  useEffect(() => {
    const listener = (event: KeyboardEvent) => onKeyDown(event);
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, []);

  const verdict =
    playing || !last
      ? ''
      : `Round ${history.length}: ${describe(mode, last)}` +
        (winner ? ` ${wins(mode, winner)} the match ${Math.max(score.one, score.two)}–${Math.min(score.one, score.two)}.` : '');

  return (
    <div className="game">
      <div className="game-top">
        <fieldset>
          <legend>Game type</legend>
          {(['player', 'computer'] as const).map((option) => (
            <label key={option}>
              <input
                type="radio"
                name="mode"
                checked={mode === option}
                aria-disabled={playing}
                onChange={() => {
                  if (!playing) dispatch({ type: 'mode', mode: option });
                }}
              />{' '}
              {option === 'player' ? 'Player vs Computer' : 'Computer vs Computer'}
            </label>
          ))}
        </fieldset>
        <table className="score">
          <caption>
            {winner ? 'Match over' : `Round ${history.length + 1}`}, first to {FIRST_TO}
          </caption>
          <thead>
            <tr>
              <td />
              <th scope="col">Rounds won</th>
              <th scope="col">Matches won</th>
            </tr>
          </thead>
          <tbody>
            {SIDES.map((side) => (
              <tr key={side}>
                <th scope="row">{NAMES[mode][side]}</th>
                <td>{score[side]}</td>
                <td>{state.tally[mode][side]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="players">
        {SIDES.map((side) => {
          const weapon = shown?.[side];
          return (
            <div className="player" key={side}>
              <h2>{NAMES[mode][side]}</h2>
              <span
                className={weapon && side === 'one' ? 'icon mirrored' : 'icon'}
                role="img"
                aria-label={weapon ? capitalize(weapon) : 'Waiting'}
              >
                {weapon ? ICON[weapon] : '❔'}
              </span>
            </div>
          );
        })}
      </div>

      {mode === 'player' && (
        <>
          <div className="weapons" role="group" aria-label="Throw" ref={weapons}>
            {WEAPONS.map((weapon) => (
              <button
                key={weapon}
                type="button"
                aria-pressed={shown?.one === weapon}
                aria-disabled={playing || !!winner}
                aria-keyshortcuts={weapon.charAt(0).toUpperCase()}
                onClick={() => play(weapon)}
              >
                <Throw weapon={weapon} />
              </button>
            ))}
          </div>
          <p className="hint">Keys: R, P, S</p>
        </>
      )}

      <div className="actions">
        {winner ? (
          <button ref={newMatchButton} type="button" className="primary" onClick={newMatch}>
            New match
          </button>
        ) : (
          mode === 'computer' && (
            <button type="button" className="primary" aria-disabled={playing} onClick={() => play()}>
              Play round
            </button>
          )
        )}
        <button
          type="button"
          className="reset"
          aria-disabled={playing}
          onClick={() => {
            if (!playing) dispatch({ type: 'reset' });
          }}
        >
          Reset
        </button>
      </div>
      <p className="verdict" role="status">{verdict}</p>

      {last && (
        <section className="history">
          <h2>This match</h2>
          <ol>
            {history.map(({ one, two, result }, i) => (
              <li key={i}>
                Round {i + 1}: <Throw weapon={one} /> vs <Throw weapon={two} />:{' '}
                {result === 'tie' ? 'Tie' : NAMES[mode][result]}
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
