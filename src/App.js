import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { HEROES, COMICS } from './custom/data';
import { shuffle, getTimeLeft, move, GAME_STATE } from './custom/utils';
import Modal from './components/Modal';
import Header from './components/Header';
import Dropzone from './components/Dropzone';
import Footer from './components/Footer';
import Highscore from './components/Highscore';
import styled from 'styled-components';
import { media } from '../src/utils/mediaTemplate'


const GAME_DURATION = 4000 * 60 * 2; // 2 minutes

const initialState = {
  // we initialize the state by populating the bench with a shuffled collection of heroes
  Óflokkað: shuffle(HEROES),
  [COMICS.MSY]: [],
  [COMICS.fodiketa]: [],
  [COMICS.burdardygg_fiskiveida]: [],
  [COMICS.fiskastovnar]: [],
  [COMICS.ovurfiskari]: [],
  [COMICS.veidiloyvi]: [],
  [COMICS.hjaveida]: [],
  [COMICS.utblak]: [],
  [COMICS.fiskiloyvi]: [],
  [COMICS.umsitingaraetlan]: [],
  [COMICS.brafeingisveidibann]: [],
  [COMICS.stongdar_leidir]: [],
  gameState: GAME_STATE.READY,
  timeLeft: 0,
};

class App extends React.Component {
  state = initialState;

  startGame = () => {
    this.currentDeadline = Date.now() + GAME_DURATION;

    this.setState(
      {
        gameState: GAME_STATE.PLAYING,
        timeLeft: getTimeLeft(this.currentDeadline),
      },
      this.gameLoop
    );
  };

  gameLoop = () => {
    this.timer = setInterval(() => {
      const timeLeft = getTimeLeft(this.currentDeadline);
      const isTimeout = timeLeft <= 0;
      if (isTimeout && this.timer) {
        clearInterval(this.timer);
      }

      this.setState({
        timeLeft: isTimeout ? 0 : timeLeft,
        ...(isTimeout ? { gameState: GAME_STATE.DONE } : {}),
      });
    }, 1000);
  };

  endGame = () => {
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (this.state.gameState === GAME_STATE.PLAYING) {
      this.setState({
        gameState: GAME_STATE.REVIEW
      });
    } else {
      this.setState({
        gameState: GAME_STATE.DONE
      });
    }
  };

  resetGame = () => {
    this.setState(initialState);
  };

  onDragEnd = ({ source, destination }) => {
    if (!destination) {
      return;
    }

    this.setState(state => {
      return move(state, source, destination);
    });
  };

  render() {
    const { gameState, timeLeft, Óflokkað, ...groups } = this.state;
    const isDropDisabled = gameState === GAME_STATE.DONE || gameState === GAME_STATE.REVIEW;
    console.log("tfgdf", this.state[COMICS.burdardygg_fiskiveida])
    return (
      <>
        <Header gameState={gameState} timeLeft={timeLeft} endGame={this.endGame} />
        {(this.state.gameState !== GAME_STATE.PLAYING && this.state.gameState !== GAME_STATE.REVIEW) && (
          <Modal
            startGame={this.startGame}
            resetGame={this.resetGame}
            timeLeft={timeLeft}
            gameState={gameState}
            groups={groups}
          />
        )}
        {(this.state.gameState === GAME_STATE.PLAYING ||
          this.state.gameState === GAME_STATE.REVIEW ||
          this.state.gameState === GAME_STATE.DONE) && (
            <>
              <DragDropContext onDragEnd={this.onDragEnd}>
                <FlexContainer>
                  <Dropzone id="Óflokkað" heroes={Óflokkað} isDropDisabled={isDropDisabled} endGame={this.endGame} gameState={gameState} />
                  <FlexColumn >
                    <Dropzone
                      id={COMICS.MSY}
                      heroes={this.state[COMICS.MSY]}
                      isDropDisabled={isDropDisabled}
                      gameState={gameState}

                    />
                    <Dropzone
                      id={COMICS.fodiketa}
                      heroes={this.state[COMICS.fodiketa]}
                      isDropDisabled={isDropDisabled}
                      gameState={gameState}
                    />
                    <Dropzone
                      id={COMICS.burdardygg_fiskiveida}
                      heroes={this.state[COMICS.burdardygg_fiskiveida]}
                      isDropDisabled={isDropDisabled}
                      gameState={gameState}
                    />
                    <Dropzone
                      id={COMICS.fiskastovnar}
                      heroes={this.state[COMICS.fiskastovnar]}
                      isDropDisabled={isDropDisabled}
                      gameState={gameState}
                    />
                    <Dropzone
                      id={COMICS.ovurfiskari}
                      heroes={this.state[COMICS.ovurfiskari]}
                      isDropDisabled={isDropDisabled}
                      gameState={gameState}
                    />
                    <Dropzone
                      id={COMICS.veidiloyvi}
                      heroes={this.state[COMICS.veidiloyvi]}
                      isDropDisabled={isDropDisabled}
                      gameState={gameState}
                    />
                    <Dropzone
                      id={COMICS.hjaveida}
                      heroes={this.state[COMICS.hjaveida]}
                      isDropDisabled={isDropDisabled}
                      gameState={gameState}
                    />
                    <Dropzone
                      id={COMICS.utblak}
                      heroes={this.state[COMICS.utblak]}
                      isDropDisabled={isDropDisabled}
                      gameState={gameState}
                    />
                    <Dropzone
                      id={COMICS.fiskiloyvi}
                      heroes={this.state[COMICS.fiskiloyvi]}
                      isDropDisabled={isDropDisabled}
                      gameState={gameState}
                    />
                    <Dropzone
                      id={COMICS.umsitingaraetlan}
                      heroes={this.state[COMICS.umsitingaraetlan]}
                      isDropDisabled={isDropDisabled}
                      gameState={gameState}
                    />
                    <Dropzone
                      id={COMICS.brafeingisveidibann}
                      heroes={this.state[COMICS.brafeingisveidibann]}
                      isDropDisabled={isDropDisabled}
                      gameState={gameState}
                    />
                    <Dropzone
                      id={COMICS.stongdar_leidir}
                      heroes={this.state[COMICS.stongdar_leidir]}
                      isDropDisabled={isDropDisabled}
                      gameState={gameState}
                    />
                  </FlexColumn>
                </FlexContainer>
              </DragDropContext>
              <Highscore />
            </>
          )}
        <Footer />
      </>
    );
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  align-self: stretch;
`

const FlexColumn = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  align-self: stretch;
  flex-wrap: wrap;

`

export default App;
