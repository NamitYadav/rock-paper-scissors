import React from 'react';
import './player.css';

const Player = ({ weapon }: any) => (
  <>
    <div>
      {weapon === 'rock' ? (
        <i className='font-icon far fa-hand-rock'></i>
      ) : weapon === 'scissors' ? (
        <i className='font-icon far fa-hand-scissors'></i>
      ) : (
        <i className='font-icon far fa-hand-paper'></i>
      )}
    </div>
  </>
);

export default Player;
