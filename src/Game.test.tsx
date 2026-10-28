import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { Game } from './Game';

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers();
  vi.spyOn(Math, 'random').mockReturnValue(0.9); // the computer always throws scissors
});
afterEach(() => vi.restoreAllMocks());

it('plays one round per Start, even when Start is clicked twice', () => {
  render(<Game />);
  fireEvent.click(screen.getByRole('button', { name: /rock/i }));
  const start = screen.getByRole('button', { name: 'Start' });
  fireEvent.click(start);
  expect(start).toBeDisabled();
  fireEvent.click(start);
  act(() => vi.advanceTimersByTime(1000));

  expect(screen.getByText('You win!')).toBeInTheDocument();
  expect(screen.getByText('You: 1')).toBeInTheDocument();
  expect(start).toBeEnabled();
});

it('shows the saved game type after a reload', () => {
  localStorage.setItem('rock-paper-scissors:state', JSON.stringify({ mode: 'computer', score: { one: 0, two: 0 } }));
  render(<Game />);
  expect(screen.getByLabelText('Computer vs Computer')).toBeChecked();
  expect(screen.getByRole('heading', { name: 'Computer 1' })).toBeInTheDocument();
});
