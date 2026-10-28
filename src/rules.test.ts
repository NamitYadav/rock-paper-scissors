import { beforeEach, expect, it } from 'vitest';
import { initialState, judge, load, reducer, save, type State } from './rules';

beforeEach(() => localStorage.clear());

it('judges every pairing', () => {
  expect(judge('rock', 'scissors')).toBe('one');
  expect(judge('scissors', 'paper')).toBe('one');
  expect(judge('paper', 'rock')).toBe('one');
  expect(judge('scissors', 'rock')).toBe('two');
  expect(judge('paper', 'scissors')).toBe('two');
  expect(judge('rock', 'paper')).toBe('two');
  expect(judge('rock', 'rock')).toBe('tie');
});

it('scores without mutating the previous state', () => {
  const before: State = Object.freeze({ ...initialState, one: 'rock', two: 'scissors', score: Object.freeze({ one: 2, two: 0 }) });
  const after = reducer(before, { type: 'settle' });
  expect(after.score).toEqual({ one: 3, two: 0 });
  expect(before.score.one).toBe(2);
});

it('keeps the player pick while shuffling, unless the computer plays both sides', () => {
  const state = { ...initialState, one: 'paper' as const };
  expect(reducer(state, { type: 'shuffle', one: 'rock', two: 'scissors' }).one).toBe('paper');
  expect(reducer({ ...state, mode: 'computer' }, { type: 'shuffle', one: 'rock', two: 'scissors' }).one).toBe('rock');
});

it('restores mode and score, and ignores malformed storage', () => {
  save({ ...initialState, mode: 'computer', score: { one: 4, two: 1 } });
  expect(load()).toMatchObject({ mode: 'computer', score: { one: 4, two: 1 } });

  localStorage.setItem('rock-paper-scissors:state', '{"mode":"x","score":{"one":"9"}}');
  expect(load()).toEqual(initialState);
  localStorage.setItem('rock-paper-scissors:state', 'not json');
  expect(load()).toEqual(initialState);
});
