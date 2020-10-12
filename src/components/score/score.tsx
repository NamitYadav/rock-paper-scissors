import React from 'react';
import { connect } from 'react-redux';

import './score.css';

const Score = (props: any) => {
  return (
    <div>
      <fieldset className='s-container'>
        <legend>Score</legend>
        <div className='s-player'>
          <div className='s-player-name'>Player 1</div>
          <div className='s-player-score'>{props.playerOne}</div>
        </div>
        <div className='s-player'>
          <div className='s-player-name'>Computer</div>
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
