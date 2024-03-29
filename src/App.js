import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { HEROES, COMICS } from './custom/data';
import { shuffle, getTimeLeft, move, GAME_STATE } from './custom/utils';
import Modal from './components/Modal';
import Header from './components/Header';
import Dropzone from './components/Dropzone';
import LabelsContainer from './components/LabelsContainer';
import Footer from './components/Footer';
import Highscore from './components/Highscore';
import styled from 'styled-components';


const GAME_DURATION = 4000 * 60 * 2; // 2 minutes

const initialState = {
  // we initialize the state by populating the bench with a shuffled collection of heroes
  Óflokkað: shuffle(HEROES),
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

    return (
      <>
        <Header gameState={gameState} timeLeft={timeLeft} endGame={this.endGame} />
        <TitleStyle>Drag orðini til røttu orðafrágreiðingina.</TitleStyle>
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
                  <FlexColumn >
                    <Dropzone
                      id={COMICS.fodiketa}
                      heroes={this.state[COMICS.fodiketa]}
                      isDropDisabled={isDropDisabled}
                      gameState={gameState}
                      color='#76d077'
                    />
                    <Dropzone
                      id={COMICS.burdardygg_fiskiveida}
                      heroes={this.state[COMICS.burdardygg_fiskiveida]}
                      isDropDisabled={isDropDisabled}
                      gameState={gameState}
                      color='#4500ffa3'
                    />
                    <Dropzone
                      id={COMICS.fiskastovnar}
                      heroes={this.state[COMICS.fiskastovnar]}
                      isDropDisabled={isDropDisabled}
                      gameState={gameState}
                      color='#eb5424'
                    />
                    <Dropzone
                      id={COMICS.ovurfiskari}
                      heroes={this.state[COMICS.ovurfiskari]}
                      isDropDisabled={isDropDisabled}
                      gameState={gameState}
                      color='#44c7f4'
                    />
                    <Dropzone
                      id={COMICS.veidiloyvi}
                      heroes={this.state[COMICS.veidiloyvi]}
                      isDropDisabled={isDropDisabled}
                      gameState={gameState}
                      color='#8a6d3bad'
                    />
                    <Dropzone
                      id={COMICS.hjaveida}
                      heroes={this.state[COMICS.hjaveida]}
                      isDropDisabled={isDropDisabled}
                      gameState={gameState}
                      color='#8a3b40ad'
                    />
                    <Dropzone
                      id={COMICS.utblak}
                      heroes={this.state[COMICS.utblak]}
                      isDropDisabled={isDropDisabled}
                      gameState={gameState}
                      color='#8a3b7ead'
                    />
                    <Dropzone
                      id={COMICS.fiskiloyvi}
                      heroes={this.state[COMICS.fiskiloyvi]}
                      isDropDisabled={isDropDisabled}
                      gameState={gameState}
                      color='#5bffe5ad'
                    />
                    <Dropzone
                      id={COMICS.umsitingaraetlan}
                      heroes={this.state[COMICS.umsitingaraetlan]}
                      isDropDisabled={isDropDisabled}
                      gameState={gameState}
                      color='#ff880075'
                    />
                    <Dropzone
                      id={COMICS.brafeingisveidibann}
                      heroes={this.state[COMICS.brafeingisveidibann]}
                      isDropDisabled={isDropDisabled}
                      gameState={gameState}
                      color='#ffe60075'
                    />
                    <Dropzone
                      id={COMICS.stongdar_leidir}
                      heroes={this.state[COMICS.stongdar_leidir]}
                      isDropDisabled={isDropDisabled}
                      gameState={gameState}
                      color='#d0d0d0'
                    />
                  </FlexColumn>
                  <LabelsContainer id="Óflokkað" heroes={Óflokkað} isDropDisabled={isDropDisabled} endGame={this.endGame} gameState={gameState} />

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
  align-items: flex-start;
  flex-direction: row;
  align-self: stretch;
`

const FlexColumn = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: row;
  flex-wrap: wrap;
  max-height: 80vh;
  overflow-y: scroll;
`

const TitleStyle = styled.h1`
  text-align: center;
  font-size: 1.2rem;
`
export default App;
