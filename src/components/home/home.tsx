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
  };

  startGame = () => {
    let counter = 0;
    let gameInterval = setInterval(() => {
      counter++;
      this.setState({
        playerTwo: weapons[Math.floor(Math.random() * weapons.length)],
        winner: '',
      });
      if (counter > 5) {
        clearInterval(gameInterval);
        console.log('Home props', this.props);
        this.setState({
          winner: this.selectWinner(),
        });
      }
    }, 100);
  };

  selectWinner = () => {
    console.log(this.props);
    const { incrementPlayerOne, incrementPlayerTwo } = this.props;
    const { playerOne, playerTwo } = this.state;

    if (playerOne === playerTwo) {
      return "Oops it's a Tie!";
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

  render() {
    const { playerOne, playerTwo, winner } = this.state;
    return (
      <div className='game-container'>
        <div className='player-container'>
          <div className='player'>
            <div className='player-1'>Player 1</div>
            <span className='inverse'><Player weapon={playerOne} /></span>
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
