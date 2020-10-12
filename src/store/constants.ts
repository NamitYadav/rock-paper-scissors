export const ACTIONS = {
  SCORE: {
    INCREMENT: {
      PLAYER_ONE: 'Actions.Score.Increment.PlayerOne',
      PLAYER_TWO: 'Actions.Score.Increment.PlayerTwo',
    },
    RESET: 'Actions.Score.Reset',
  },
  GAME_TYPE_ENUM: 'Actions.GameType',
};

export enum WEAPONS_ENUM {
  ROCK = 'rock',
  PAPER = 'paper',
  SCISSORS = 'scissors',
}

export const WEAPONS = [WEAPONS_ENUM.ROCK, WEAPONS_ENUM.PAPER, WEAPONS_ENUM.SCISSORS];

export enum GAME_TYPE_ENUM {
  PLAYER = 'player',
  COMPUTER = 'computer',
}
