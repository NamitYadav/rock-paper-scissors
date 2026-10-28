export const WEAPONS = ['rock', 'paper', 'scissors'] as const;
export type Weapon = (typeof WEAPONS)[number];
export type Mode = 'player' | 'computer';
export type Side = 'one' | 'two';
export type Result = 'tie' | Side;
export type Score = Record<Side, number>;
export interface Round { one: Weapon; two: Weapon; result: Result }

export const SIDES: readonly Side[] = ['one', 'two'];
export const FIRST_TO = 3;

const BEATS: Record<Weapon, Weapon> = { rock: 'scissors', paper: 'rock', scissors: 'paper' };

export const judge = (one: Weapon, two: Weapon): Result =>
  one === two ? 'tie' : BEATS[one] === two ? 'one' : 'two';

export const randomWeapon = (): Weapon => WEAPONS[Math.floor(Math.random() * WEAPONS.length)]!;

// Round wins are derived from the history rather than stored, so the two can never disagree.
export function roundWins(history: readonly Round[]): Score {
  const wins = { one: 0, two: 0 };
  for (const { result } of history) if (result !== 'tie') wins[result]++;
  return wins;
}

export function matchWinner(history: readonly Round[]): Side | null {
  const wins = roundWins(history);
  return wins.one >= FIRST_TO ? 'one' : wins.two >= FIRST_TO ? 'two' : null;
}

export interface State {
  mode: Mode;
  history: Round[]; // the current match, oldest first
  tally: Record<Mode, Score>; // matches won, per mode so "You" never inherits "Computer 1"'s wins
}

export type Action =
  | { type: 'mode'; mode: Mode }
  | { type: 'play'; one: Weapon; two: Weapon }
  | { type: 'newMatch' }
  | { type: 'reset' };

export const initialState: State = {
  mode: 'player',
  history: [],
  tally: { player: { one: 0, two: 0 }, computer: { one: 0, two: 0 } },
};

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'mode':
      // A match belongs to one mode: switching abandons it, so no throw carries over.
      return action.mode === state.mode ? state : { ...state, mode: action.mode, history: [] };
    case 'play': {
      if (matchWinner(state.history)) return state;
      const { one, two } = action;
      const history = [...state.history, { one, two, result: judge(one, two) }];
      const winner = matchWinner(history);
      if (!winner) return { ...state, history };
      const score = state.tally[state.mode];
      return { ...state, history, tally: { ...state.tally, [state.mode]: { ...score, [winner]: score[winner] + 1 } } };
    }
    case 'newMatch':
      return { ...state, history: [] };
    case 'reset':
      return { ...initialState, mode: state.mode };
  }
}

const KEY = 'rock-paper-scissors:state';

const isWeapon = (value: unknown): value is Weapon => WEAPONS.includes(value as Weapon);
const isCount = (value: unknown) => Number.isInteger(value) && (value as number) >= 0;
const isScore = (score?: Partial<Score>) => isCount(score?.one) && isCount(score?.two);
const isRound = (round?: Partial<Round>) =>
  isWeapon(round?.one) && isWeapon(round.two) && round.result === judge(round.one, round.two);

// Every persisted field is checked; anything malformed in storage falls back to a fresh game.
export function load(): State {
  try {
    const { mode, history, tally } = JSON.parse(localStorage.getItem(KEY) ?? 'null') ?? {};
    if (
      (mode === 'player' || mode === 'computer') &&
      Array.isArray(history) &&
      history.every(isRound) &&
      !matchWinner(history.slice(0, -1)) && // no rounds after the match was decided
      isScore(tally?.player) &&
      isScore(tally?.computer)
    ) {
      return { mode, history, tally };
    }
  } catch {
    // Unreadable storage: start fresh.
  }
  return initialState;
}

export function save(state: State) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Private mode or full storage: the game still works, it just won't remember.
  }
}
