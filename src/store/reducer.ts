import ACTIONS from './constants';

const initialState = () => ({
  playerOne: 0,
  playerTwo: 0,
});

const rootReducer = (state = initialState(), action: any) => {
  switch (action.type) {
    case ACTIONS.SCORE.INCREMENT.PLAYER_ONE:
      return { ...state, playerOne: ++state.playerOne };
    case ACTIONS.SCORE.INCREMENT.PLAYER_TWO:
      return { ...state, playerTwo: ++state.playerTwo };
    case ACTIONS.SCORE.RESET:
      return {
        ...state,
        playerOne: 0,
        playerTwo: 0,
      };
    default:
      return state;
  }
};

export default rootReducer;
