import React from 'react';
import { connect } from 'react-redux';

import './weapon-btn.css';
import { WEAPONS_ENUM } from '../../store/constants';
import { setGameType } from '../../store/actions';

interface Props {
  selectWeapon: { (weapon: WEAPONS_ENUM): void };
}

const WeaponBtn = ({ selectWeapon }: Props) => (
  <>
    <div className='weaponBtn-container'>
      <button className='weaponBtn' onClick={() => selectWeapon(WEAPONS_ENUM.ROCK)}>
        <i className='home-weapon-icon far fa-hand-rock'></i>Rock
      </button>
      <button className='weaponBtn' onClick={() => selectWeapon(WEAPONS_ENUM.PAPER)}>
        <i className='home-weapon-icon far fa-hand-paper'></i>Paper
      </button>
      <button className='weaponBtn' onClick={() => selectWeapon(WEAPONS_ENUM.SCISSORS)}>
        <i className='home-weapon-icon far fa-hand-scissors'></i>Scissor
      </button>
    </div>
  </>
);

const mapDispatchToProps = { setGameType };

export default connect(null, mapDispatchToProps)(WeaponBtn);
