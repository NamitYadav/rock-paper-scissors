import React, { Component } from 'react';
import { connect } from 'react-redux';

import { incrementPlayerOne, incrementPlayerTwo, resetScore } from '../../store/actions';
import Player from '../player/player';
import './home.css';

const weapons = ['rock', 'paper', 'scissors'];

interface Props {
  incrementPlayerOne: any;
  incrementPlayerTwo: any;
  resetScore: any;
}

class Home extends Component<Props> {
  state = {
    playerOne: weapons[0],
    playerTwo: weapons[0],
    winner: '',
    gameType: 'player',
  };

  startGame = () => {
    const { gameType } = this.state;
    let counter = 0;
    let gameInterval = setInterval(() => {
      counter++;
      if (gameType === 'player') {
        this.setState({
          playerTwo: weapons[Math.floor(Math.random() * weapons.length)],
          winner: '',
        });
      } else {
        this.setState({
          playerOne: weapons[Math.floor(Math.random() * weapons.length)],
          playerTwo: weapons[Math.floor(Math.random() * weapons.length)],
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
      (playerOne === 'rock' && playerTwo === 'scissors') ||
      (playerOne === 'scissors' && playerTwo === 'paper') ||
      (playerOne === 'paper' && playerTwo === 'rock')
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

  onGameTypeChange = (event: any) => {
    this.setState({ gameType: event.target.value });
  };

  render() {
    const { playerOne, playerTwo, winner, gameType } = this.state;
    return (
      <div className='game-container'>
        <div onChange={this.onGameTypeChange}>
          <fieldset className='radio-group'>
            <legend>Select Game Type</legend>
            <span>
              <input type='radio' value='player' name='game-type' defaultChecked /> Player vs
              Computer
            </span>
            <span>
              <input type='radio' value='computer' name='game-type' /> Computer vs Computer
            </span>
          </fieldset>
        </div>
        <div className='player-container'>
          <div className='player'>
            <div className='player-1'>{gameType}</div>
            <span className='inverse'>
              <Player weapon={playerOne} />
            </span>
            {gameType === 'player' && (
              <div className='weaponBtn-container'>
                <button className='weaponBtn' onClick={() => this.selectWeapon('rock')}>
                  <i className='home-weapon-icon far fa-hand-rock'></i>Rock
                </button>
                <button className='weaponBtn' onClick={() => this.selectWeapon('paper')}>
                  <i className='home-weapon-icon far fa-hand-paper'></i>Paper
                </button>
                <button className='weaponBtn' onClick={() => this.selectWeapon('scissors')}>
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
        <div className='home-button-container'>
          <button type='button' className='start-button' onClick={this.startGame}>
            START
          </button>
          <button type='button' className='reset-button' onClick={this.resetGame}>
            RESET
          </button>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = { incrementPlayerOne, incrementPlayerTwo, resetScore };

export default connect(null, mapDispatchToProps)(Home);
