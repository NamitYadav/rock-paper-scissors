export const WEAPONS = ['rock', 'paper', 'scissors'] as const;
export type Weapon = (typeof WEAPONS)[number];
export type Mode = 'player' | 'computer';
export type Result = 'tie' | 'one' | 'two';

const BEATS: Record<Weapon, Weapon> = { rock: 'scissors', paper: 'rock', scissors: 'paper' };

export const judge = (one: Weapon, two: Weapon): Result =>
  one === two ? 'tie' : BEATS[one] === two ? 'one' : 'two';

export const randomWeapon = (): Weapon => WEAPONS[Math.floor(Math.random() * WEAPONS.length)]!;

export interface State {
  mode: Mode;
  one: Weapon;
  two: Weapon;
  score: { one: number; two: number };
  result: Result | null;
}

export type Action =
  | { type: 'mode'; mode: Mode }
  | { type: 'pick'; weapon: Weapon }
  // One animation frame. Player one keeps their pick unless the computer plays both sides.
  | { type: 'shuffle'; one: Weapon; two: Weapon }
  | { type: 'settle' }
  | { type: 'reset' };

export const initialState: State = {
  mode: 'player',
  one: 'rock',
  two: 'paper',
  score: { one: 0, two: 0 },
  result: null,
};

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'mode':
      return { ...state, mode: action.mode, result: null };
    case 'pick':
      return { ...state, one: action.weapon, result: null };
    case 'shuffle':
      return { ...state, one: state.mode === 'computer' ? action.one : state.one, two: action.two, result: null };
    case 'settle': {
      const result = judge(state.one, state.two);
      const score = result === 'tie' ? state.score : { ...state.score, [result]: state.score[result] + 1 };
      return { ...state, score, result };
    }
    case 'reset':
      return { ...state, score: { one: 0, two: 0 }, result: null };
  }
}

const KEY = 'rock-paper-scissors:state';

// Only the mode and the score persist; anything malformed in storage falls back to a fresh game.
export function load(): State {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? 'null');
    if (
      (saved?.mode === 'player' || saved?.mode === 'computer') &&
      Number.isInteger(saved.score?.one) &&
      Number.isInteger(saved.score?.two)
    ) {
      return { ...initialState, mode: saved.mode, score: { one: saved.score.one, two: saved.score.two } };
    }
  } catch {
    // Unreadable storage: start fresh.
  }
  return initialState;
}

export function save({ mode, score }: State) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ mode, score }));
  } catch {
    // Private mode or full storage: the game still works, it just won't remember.
  }
}
