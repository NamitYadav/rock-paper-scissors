import React from 'react';
import { connect } from 'react-redux';
import { WEAPONS_ENUM } from '../../store/constants';

import './score.css';

interface Props {
  playerOne?: WEAPONS_ENUM;
  playerTwo?: WEAPONS_ENUM;
}

const Score = (props: Props) => {
  return (
    <div>
      <fieldset className='s-container'>
        <legend>Score Board</legend>
        <div className='s-player'>
          <span className='s-player-name'>Player 1: </span>
          <span className='s-player-score'>{props.playerOne}</span>
        </div>
        <div className='s-player'>
          <span className='s-player-name'>Player 2: </span>
          <span className='s-player-score'>{props.playerTwo}</span>
        </div>
      </fieldset>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    playerOne: state.playerOne,
    playerTwo: state.playerTwo,
  };
};

export default connect(mapStateToProps, null)(Score);
