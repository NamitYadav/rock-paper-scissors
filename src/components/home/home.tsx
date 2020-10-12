import React, { Component } from 'react';
import { connect } from 'react-redux';

import Score from '../score/score';
import { incrementPlayerOne, incrementPlayerTwo, resetScore } from '../../store/actions';
import Player from '../player/player';
import './home.css';
import { WEAPONS, GAME_TYPE_ENUM, WEAPONS_ENUM } from '../../store/constants';
import GameTypeSelector from '../game-type-selector/game-type-selector';
import WeaponBtn from '../weapon-btn/weapon-btn';

interface Props {
  incrementPlayerOne: { (): void };
  incrementPlayerTwo: { (): void };
  resetScore: { (): void };
  gameType: GAME_TYPE_ENUM;
}

class Home extends Component<Props> {
  state = {
    playerOne: WEAPONS[0],
    playerTwo: WEAPONS[0],
    winner: '',
  };

  startGame = () => {
    const { gameType } = this.props;
    let counter = 0;
    let gameInterval = setInterval(() => {
      counter++;
      if (gameType === GAME_TYPE_ENUM.PLAYER) {
        this.setState({
          playerTwo: WEAPONS[Math.floor(Math.random() * WEAPONS.length)],
          winner: '',
        });
      } else {
        this.setState({
          playerOne: WEAPONS[Math.floor(Math.random() * WEAPONS.length)],
          playerTwo: WEAPONS[Math.floor(Math.random() * WEAPONS.length)],
          winner: '',
        });
      }
      if (counter > 5) {
        clearInterval(gameInterval);
        this.setState({
          winner: this.selectWinner(),
        });
      }
    }, 100);
  };

  selectWinner = () => {
    const { incrementPlayerOne, incrementPlayerTwo } = this.props;
    const { playerOne, playerTwo } = this.state;

    if (playerOne === playerTwo) {
      return "It's a Tie!";
    } else if (
      (playerOne === WEAPONS_ENUM.ROCK && playerTwo === WEAPONS_ENUM.SCISSORS) ||
      (playerOne === WEAPONS_ENUM.SCISSORS && playerTwo === WEAPONS_ENUM.PAPER) ||
      (playerOne === WEAPONS_ENUM.PAPER && playerTwo === WEAPONS_ENUM.ROCK)
    ) {
      incrementPlayerOne();
      return 'Player One Wins!';
    } else {
      incrementPlayerTwo();
      return 'Player Two Wins!';
    }
  };

  selectWeapon = (weapon: any) => {
    this.setState({
      playerOne: weapon,
      winner: '',
    });
  };

  resetGame = () => {
    const { resetScore } = this.props;
    this.setState({ winner: '' });
    resetScore();
  };

  render() {
    const { gameType } = this.props;
    const { playerOne, playerTwo, winner } = this.state;
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
                <Player weapon={playerOne} />
              </span>
              {gameType === GAME_TYPE_ENUM.PLAYER && <WeaponBtn selectWeapon={this.selectWeapon} />}
            </div>
            <div className='player'>
              <div className='player-2'>Computer</div>
              <Player weapon={playerTwo} />
            </div>
          </div>
          <div className='winner'>{winner || ''}</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return { gameType: state.gameType };
};

const mapDispatchToProps = { incrementPlayerOne, incrementPlayerTwo, resetScore };

export default connect(mapStateToProps, mapDispatchToProps)(Home);
