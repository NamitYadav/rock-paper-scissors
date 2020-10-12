import { ACTIONS, WEAPONS_ENUM } from './constants';

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
  type: ACTIONS.GAME_TYPE_ENUM,
  gameType,
});

export const changePlayerOneWeapon = (weapon: WEAPONS_ENUM) => ({
  type: ACTIONS.WEAPON.CHANGE.PLAYER_ONE,
  weapon,
});

export const changePlayerTwoWeapon = (weapon: WEAPONS_ENUM) => ({
  type: ACTIONS.WEAPON.CHANGE.PLAYER_TWO,
  weapon,
});
