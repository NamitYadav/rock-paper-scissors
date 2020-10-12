import React from 'react';

import './player.css';
import { WEAPONS_ENUM } from '../../store/constants';

interface Props {
  weapon: WEAPONS_ENUM;
}

const Player = ({ weapon }: Props) => (
  <>
    <div>
      {weapon === WEAPONS_ENUM.ROCK ? (
        <i className='font-icon far fa-hand-rock'></i>
      ) : weapon === WEAPONS_ENUM.SCISSORS ? (
        <i className='font-icon far fa-hand-scissors'></i>
      ) : (
        <i className='font-icon far fa-hand-paper'></i>
      )}
    </div>
  </>
);

export default Player;
