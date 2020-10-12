import React from 'react';
import { connect } from 'react-redux';

import './game-type-selector.css';
import { GAME_TYPE_ENUM } from '../../store/constants';
import { setGameType } from '../../store/actions';

interface Props {
  setGameType: { (gameType: GAME_TYPE_ENUM): void };
}

const GameTypeSelector = ({ setGameType }: Props) => (
  <>
    <div
      onChange={(event: any) => {
        setGameType(event.target.value);
      }}>
      <fieldset className='radio-group'>
        <legend>Select Game Type</legend>
        <span className='radio-item'>
          <input type='radio' value={GAME_TYPE_ENUM.PLAYER} name='game-type' defaultChecked />{' '}
          Player vs Computer
        </span>
        <span className='radio-item'>
          <input type='radio' value={GAME_TYPE_ENUM.COMPUTER} name='game-type' /> Computer vs
          Computer
        </span>
      </fieldset>
    </div>
  </>
);

const mapDispatchToProps = { setGameType };

export default connect(null, mapDispatchToProps)(GameTypeSelector);
