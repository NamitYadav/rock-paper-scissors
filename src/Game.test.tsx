import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { Game } from './Game';

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers();
  vi.spyOn(Math, 'random').mockReturnValue(0.9); // the computer always throws scissors
});
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

const button = (name: string) => screen.getByRole('button', { name });
const verdict = () => screen.getByRole('status');
const rounds = () => screen.queryAllByRole('listitem');
const finishRound = () => act(() => vi.advanceTimersByTime(1000));
const throwWeapon = (name: string) => {
  fireEvent.click(button(name));
  finishRound();
};

it('throws the clicked weapon and names both throws in the verdict', () => {
  render(<Game />);
  expect(screen.getAllByRole('img', { name: 'Waiting' })).toHaveLength(2);

  throwWeapon('Rock');
  expect(verdict()).toHaveTextContent('Round 1: Rock beats scissors. You win the round.');
  expect(screen.getByRole('img', { name: 'Scissors' })).toBeInTheDocument();
  expect(button('Rock')).toHaveAttribute('aria-pressed', 'true');
  expect(rounds()[0]).toHaveTextContent('Round 1: ✊ Rock vs ✌️ Scissors: You');
  expect(screen.getByRole('row', { name: 'You 1 0' })).toBeInTheDocument();
});

it('keeps focus on the clicked weapon through the round', () => {
  render(<Game />);
  const paper = button('Paper');
  paper.focus();
  fireEvent.click(paper);
  // aria-disabled, never disabled: a disabled button would drop focus to <body>.
  expect(paper).toHaveAttribute('aria-disabled', 'true');
  expect(paper).toBeEnabled();
  finishRound();
  expect(paper).toHaveFocus();
  expect(paper).toHaveAttribute('aria-disabled', 'false');
});

it('throws with the R, P and S keys, unless a modifier is held', () => {
  render(<Game />);
  fireEvent.keyDown(document.body, { key: 'p', ctrlKey: true });
  finishRound();
  expect(rounds()).toHaveLength(0);

  fireEvent.keyDown(document.body, { key: 'p' });
  finishRound();
  expect(verdict()).toHaveTextContent('Round 1: Scissors beats paper. Computer wins the round.');
});

it('ignores keys mid-round', () => {
  render(<Game />);
  fireEvent.keyDown(document.body, { key: 's' });
  fireEvent.keyDown(document.body, { key: 'r' });
  finishRound();
  expect(rounds()).toHaveLength(1);
  expect(verdict()).toHaveTextContent('Both threw scissors. Tie.');
});

it("announces a tie, which doesn't count", () => {
  render(<Game />);
  throwWeapon('Scissors');
  expect(verdict()).toHaveTextContent('Round 1: Both threw scissors. Tie.');
  expect(rounds()[0]).toHaveTextContent('Round 1: ✌️ Scissors vs ✌️ Scissors: Tie');
  expect(screen.getByRole('row', { name: 'You 0 0' })).toBeInTheDocument();
});

it('ends the match at three wins and hands focus to New match', () => {
  render(<Game />);
  throwWeapon('Rock');
  throwWeapon('Paper');
  throwWeapon('Rock');
  throwWeapon('Rock');
  expect(verdict()).toHaveTextContent('Round 4: Rock beats scissors. You win the round. You win the match 3–1.');
  expect(button('New match')).toHaveFocus();
  expect(screen.getByRole('row', { name: 'You 3 1' })).toBeInTheDocument();

  throwWeapon('Rock');
  expect(rounds()).toHaveLength(4);

  fireEvent.click(button('New match'));
  expect(button('Rock')).toHaveFocus();
  expect(rounds()).toHaveLength(0);
  expect(screen.getByRole('row', { name: 'You 0 1' })).toBeInTheDocument();
});

it('plays Computer vs Computer rounds with the Play round button', () => {
  let calls = 0;
  vi.mocked(Math.random).mockImplementation(() => (calls++ % 2 ? 0.9 : 0)); // Computer 1 rock, Computer 2 scissors
  render(<Game />);
  fireEvent.click(screen.getByLabelText('Computer vs Computer'));
  expect(screen.queryByRole('button', { name: 'Rock' })).toBeNull();

  throwWeapon('Play round');
  expect(verdict()).toHaveTextContent('Round 1: Rock beats scissors. Computer 1 wins the round.');
});

it('Reset clears the match, the history and the tally', () => {
  render(<Game />);
  for (let i = 0; i < 3; i++) throwWeapon('Rock');
  fireEvent.click(button('New match'));
  throwWeapon('Rock');

  fireEvent.click(button('Reset'));
  expect(rounds()).toHaveLength(0);
  expect(verdict()).toBeEmptyDOMElement();
  expect(screen.getByRole('row', { name: 'You 0 0' })).toBeInTheDocument();
});

it('remembers the game after a reload', () => {
  const { unmount } = render(<Game />);
  fireEvent.click(screen.getByLabelText('Computer vs Computer'));
  throwWeapon('Play round');
  unmount();

  render(<Game />);
  expect(screen.getByLabelText('Computer vs Computer')).toBeChecked();
  expect(rounds()[0]).toHaveTextContent('Round 1: ✌️ Scissors vs ✌️ Scissors: Tie');
});

it('stops the animation on unmount', () => {
  const setInterval = vi.spyOn(window, 'setInterval');
  const clearInterval = vi.spyOn(window, 'clearInterval');
  const { unmount } = render(<Game />);
  fireEvent.click(button('Rock'));
  unmount();
  expect(clearInterval).toHaveBeenCalledWith(setInterval.mock.results[0]?.value);
});

it('settles at once, without timers, when reduced motion is preferred', () => {
  vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true } as MediaQueryList);
  const setInterval = vi.spyOn(window, 'setInterval');
  render(<Game />);
  fireEvent.click(button('Rock'));
  expect(setInterval).not.toHaveBeenCalled();
  expect(verdict()).toHaveTextContent('Round 1: Rock beats scissors. You win the round.');
});
