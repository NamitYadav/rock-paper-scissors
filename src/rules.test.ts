import { beforeEach, describe, expect, it } from 'vitest';
import { initialState, judge, load, matchWinner, reducer, roundWins, save, type Action, type State, type Weapon } from './rules';

beforeEach(() => localStorage.clear());

const play = (one: Weapon, two: Weapon): Action => ({ type: 'play', one, two });
const run = (state: State, ...actions: Action[]) => actions.reduce(reducer, state);
const WIN = play('rock', 'scissors');
const LOSS = play('rock', 'paper');
const TIE = play('rock', 'rock');

it('judges every pairing', () => {
  expect(judge('rock', 'scissors')).toBe('one');
  expect(judge('scissors', 'paper')).toBe('one');
  expect(judge('paper', 'rock')).toBe('one');
  expect(judge('scissors', 'rock')).toBe('two');
  expect(judge('paper', 'scissors')).toBe('two');
  expect(judge('rock', 'paper')).toBe('two');
  expect(judge('rock', 'rock')).toBe('tie');
});

it('records rounds without mutating the previous state', () => {
  const before = run(initialState, WIN);
  const after = reducer(before, LOSS);
  expect(before.history).toHaveLength(1);
  expect(after.history).toEqual([
    { one: 'rock', two: 'scissors', result: 'one' },
    { one: 'rock', two: 'paper', result: 'two' },
  ]);
});

it("doesn't count ties towards the match", () => {
  const state = run(initialState, TIE, TIE, WIN, TIE);
  expect(state.history).toHaveLength(4);
  expect(roundWins(state.history)).toEqual({ one: 1, two: 0 });
  expect(matchWinner(state.history)).toBeNull();
});

it('ends the match at three round wins, counts it once and blocks further throws', () => {
  const won = run(initialState, WIN, LOSS, WIN, TIE, LOSS, WIN);
  expect(matchWinner(won.history)).toBe('one');
  expect(won.tally.player).toEqual({ one: 1, two: 0 });
  expect(run(won, LOSS, LOSS, LOSS)).toBe(won);
});

it('starts a new match without losing the tally', () => {
  const won = run(initialState, LOSS, LOSS, LOSS);
  const next = reducer(won, { type: 'newMatch' });
  expect(next.history).toEqual([]);
  expect(next.tally.player).toEqual({ one: 0, two: 1 });
});

it('resets the match, history and tally, keeping the mode', () => {
  const state = run(initialState, { type: 'mode', mode: 'computer' }, WIN, WIN, WIN, { type: 'newMatch' }, TIE);
  expect(reducer(state, { type: 'reset' })).toEqual({ ...initialState, mode: 'computer' });
});

it('abandons the match on a mode switch, so no throw carries over, and keeps a tally per mode', () => {
  const state = run(initialState, { type: 'mode', mode: 'computer' }, WIN, WIN, WIN, { type: 'newMatch' }, LOSS);
  const player = reducer(state, { type: 'mode', mode: 'player' });
  expect(player.history).toEqual([]);
  expect(player.tally).toEqual({ player: { one: 0, two: 0 }, computer: { one: 1, two: 0 } });
});

describe('load', () => {
  const saved = run(initialState, WIN, WIN, WIN, { type: 'newMatch' }, WIN, TIE);
  const win = { one: 'rock', two: 'scissors', result: 'one' };

  it('restores a saved game', () => {
    save(saved);
    expect(load()).toEqual(saved);
  });

  it.each([
    ['nothing', null],
    ['unparseable JSON', 'not json'],
    ['the old format', { mode: 'player', score: { one: 1, two: 0 } }],
    ['an unknown mode', { ...saved, mode: 'x' }],
    ['a history that is not a list', { ...saved, history: { 0: win } }],
    ['an unknown weapon', { ...saved, history: [{ ...win, one: 'lizard' }] }],
    ['a result that contradicts the throws', { ...saved, history: [{ ...win, result: 'two' }] }],
    ['rounds after the match was decided', { ...saved, history: [win, win, win, win] }],
    ['a missing tally', { ...saved, tally: { player: { one: 1, two: 0 } } }],
    ['a negative tally', { ...saved, tally: { ...saved.tally, computer: { one: -1, two: 0 } } }],
    ['a fractional tally', { ...saved, tally: { ...saved.tally, player: { one: 1.5, two: 0 } } }],
    ['a numeric string in the tally', { ...saved, tally: { ...saved.tally, player: { one: '1', two: 0 } } }],
  ])('starts fresh given %s', (_, stored) => {
    if (stored !== null) localStorage.setItem('rock-paper-scissors:state', typeof stored === 'string' ? stored : JSON.stringify(stored));
    expect(load()).toEqual(initialState);
  });
});
