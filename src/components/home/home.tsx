import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  incrementPlayerOne,
  incrementPlayerTwo,
  resetScore,
  setGameType,
} from '../../store/actions';
import Player from '../player/player';
import './home.css';
import { WEAPONS, GAME_TYPE_ENUM, WEAPONS_ENUM } from '../../store/constants';

interface Props {
  incrementPlayerOne: { (): void };
  incrementPlayerTwo: { (): void };
  resetScore: { (): void };
  gameType: GAME_TYPE_ENUM;
  setGameType: { (gameType: GAME_TYPE_ENUM): void };
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
    const { gameType, setGameType } = this.props;
    const { playerOne, playerTwo, winner } = this.state;
    return (
      <div className='game-container'>
        <div
          onChange={(event: any) => {
            setGameType(event.target.value);
          }}>
          <fieldset className='radio-group'>
            <legend>Select Game Type</legend>
            <span>
              <input type='radio' value={GAME_TYPE_ENUM.PLAYER} name='game-type' defaultChecked />{' '}
              Player vs Computer
            </span>
            <span>
              <input type='radio' value={GAME_TYPE_ENUM.COMPUTER} name='game-type' /> Computer vs
              Computer
            </span>
          </fieldset>
        </div>
        <div className='home-button-container'>
          <button type='button' className='start-button' onClick={this.startGame}>
            START
          </button>
          <button type='button' className='reset-button' onClick={this.resetGame}>
            RESET
          </button>
        </div>
        <div className='player-container'>
          <div className='player'>
            <div className='player-1'>{gameType}</div>
            <span className='inverse'>
              <Player weapon={playerOne} />
            </span>
            {gameType === GAME_TYPE_ENUM.PLAYER && (
              <div className='weaponBtn-container'>
                <button className='weaponBtn' onClick={() => this.selectWeapon(WEAPONS_ENUM.ROCK)}>
                  <i className='home-weapon-icon far fa-hand-rock'></i>Rock
                </button>
                <button className='weaponBtn' onClick={() => this.selectWeapon(WEAPONS_ENUM.PAPER)}>
                  <i className='home-weapon-icon far fa-hand-paper'></i>Paper
                </button>
                <button
                  className='weaponBtn'
                  onClick={() => this.selectWeapon(WEAPONS_ENUM.SCISSORS)}>
                  <i className='home-weapon-icon far fa-hand-scissors'></i>Scissor
                </button>
              </div>
            )}
          </div>
          <div className='player'>
            <div className='player-2'>Computer</div>
            <Player weapon={playerTwo} />
          </div>
        </div>
        <div className='winner'>{winner || ''}</div>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return { gameType: state.gameType };
};

const mapDispatchToProps = { incrementPlayerOne, incrementPlayerTwo, resetScore, setGameType };

export default connect(mapStateToProps, mapDispatchToProps)(Home);
