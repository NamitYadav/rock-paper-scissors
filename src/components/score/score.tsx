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
        <legend>Score</legend>
        <div className='s-player'>
          <div className='s-player-name'>Player 1</div>
          <div className='s-player-score'>{props.playerOne}</div>
        </div>
        <div className='s-player'>
          <div className='s-player-name'>Player 2</div>
          <div className='s-player-score'>{props.playerTwo}</div>
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
