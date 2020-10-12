import ACTIONS from './constants';

export const incrementPlayerOne = () => ({
  type: ACTIONS.SCORE.INCREMENT.PLAYER_ONE,
});

export const incrementPlayerTwo = () => ({
  type: ACTIONS.SCORE.INCREMENT.PLAYER_TWO,
});

export const resetScore = () => ({
  type: ACTIONS.SCORE.RESET,
});

export const setGameType = (gameType: string) => ({
  type: ACTIONS.GAME_TYPE,
  gameType,
});