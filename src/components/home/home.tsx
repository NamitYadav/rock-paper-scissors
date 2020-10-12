import React, { Component } from 'react';
import { connect } from 'react-redux';

import Score from '../score/score';
import {
  incrementPlayerOne,
  incrementPlayerTwo,
  resetScore,
  changePlayerOneWeapon,
  changePlayerTwoWeapon,
} from '../../store/actions';
import Player from '../player/player';
import './home.css';
import { WEAPONS, GAME_TYPE_ENUM, WEAPONS_ENUM } from '../../store/constants';
import GameTypeSelector from '../game-type-selector/game-type-selector';
import WeaponBtn from '../weapon-btn/weapon-btn';

interface Props {
  gameType: GAME_TYPE_ENUM;
  playerOneWeapon: WEAPONS_ENUM;
  playerTwoWeapon: WEAPONS_ENUM;
  incrementPlayerOne: { (): void };
  incrementPlayerTwo: { (): void };
  resetScore: { (): void };
  changePlayerOneWeapon: { (weapon: WEAPONS_ENUM): void };
  changePlayerTwoWeapon: { (weapon: WEAPONS_ENUM): void };
}

class Home extends Component<Props> {
  state = {
    winner: '',
  };

  startGame = () => {
    const { gameType, changePlayerOneWeapon, changePlayerTwoWeapon } = this.props;
    let counter = 0;
    let gameInterval = setInterval(() => {
      counter++;
      if (gameType === GAME_TYPE_ENUM.PLAYER) {
        changePlayerTwoWeapon(WEAPONS[Math.floor(Math.random() * WEAPONS.length)]);
        this.setState({ winner: '' });
      } else {
        changePlayerOneWeapon(WEAPONS[Math.floor(Math.random() * WEAPONS.length)]);
        changePlayerTwoWeapon(WEAPONS[Math.floor(Math.random() * WEAPONS.length)]);
        this.setState({ winner: '' });
      }
      if (counter > 5) {
        clearInterval(gameInterval);
        this.setState({ winner: this.selectWinner() });
      }
    }, 100);
  };

  selectWinner = () => {
    const { incrementPlayerOne, incrementPlayerTwo, playerOneWeapon, playerTwoWeapon } = this.props;

    if (playerOneWeapon === playerTwoWeapon) {
      return "It's a Tie!";
    } else if (
      (playerOneWeapon === WEAPONS_ENUM.ROCK && playerTwoWeapon === WEAPONS_ENUM.SCISSORS) ||
      (playerOneWeapon === WEAPONS_ENUM.SCISSORS && playerTwoWeapon === WEAPONS_ENUM.PAPER) ||
      (playerOneWeapon === WEAPONS_ENUM.PAPER && playerTwoWeapon === WEAPONS_ENUM.ROCK)
    ) {
      incrementPlayerOne();
      return 'Player One Wins!';
    } else {
      incrementPlayerTwo();
      return 'Player Two Wins!';
    }
  };

  selectWeapon = (weapon: any) => {
    const { changePlayerOneWeapon } = this.props;
    changePlayerOneWeapon(weapon);
    this.setState({ winner: '' });
  };

  resetGame = () => {
    const { resetScore } = this.props;
    this.setState({ winner: '' });
    resetScore();
  };

  render() {
    const { gameType, playerOneWeapon, playerTwoWeapon } = this.props;
    const { winner } = this.state;
    return (
      <div className='game-container'>
        <div className='game-top'>
          <div>
            <GameTypeSelector />
            <div className='home-button-container'>
              <button type='button' className='start-button' onClick={this.startGame}>
                START
              </button>
              <button type='button' className='reset-button' onClick={this.resetGame}>
                RESET
              </button>
            </div>
          </div>
          <Score />
        </div>

        <div className='game-bottom'>
          <div className='player-container'>
            <div className='player'>
              <div className='player-1'>{gameType}</div>
              <span className='inverse'>
                <Player weapon={playerOneWeapon} />
              </span>
              {gameType === GAME_TYPE_ENUM.PLAYER && <WeaponBtn selectWeapon={this.selectWeapon} />}
            </div>
            <div className='player'>
              <div className='player-2'>Computer</div>
              <Player weapon={playerTwoWeapon} />
            </div>
          </div>
          <div className='winner'>{winner || ''}</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    gameType: state.gameType,
    playerOneWeapon: state.playerOneWeapon,
    playerTwoWeapon: state.playerTwoWeapon,
  };
};

const mapDispatchToProps = {
  incrementPlayerOne,
  incrementPlayerTwo,
  resetScore,
  changePlayerOneWeapon,
  changePlayerTwoWeapon,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
