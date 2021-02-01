import React, { useState } from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import styled from 'styled-components'
import PopupHero from './PopupHero'

const LabelsContainer = ({ isDropDisabled, heroes, id, endGame, gameState, color }) => {
  const [selectedHero, setSelectedHero] = useState("")

  return (
    <HeroContainerStyle>
    <div style={{ marginTop: "20px", borderBottom: `${gameState === "review" ? `10px ${color} solid` : ""}` }}>{'Yvirskriftir'}</div>
      <Droppable droppableId={id} isDropDisabled={isDropDisabled}>
        {(provided) => {
          return (
            <HeroSubContainerStyle
              className="menu hero-list"
              {...provided.droppableProps}
              ref={provided.innerRef}
              grouped={id !== `Óflokkad` ? true : false}
            >
              {heroes.map(({ name, color, rank, description, comics }, index) => (
                <Hero key={name} name={name} description={description} index={index}
                  color={color} gameState={gameState} rank={rank}
                  selectedHero={selectedHero}
                  setSelectedHero={setSelectedHero}
                  comics={comics}
                />
              ))}
              {provided.placeholder}
            </HeroSubContainerStyle>
          )
        }}
      </Droppable>
    </HeroContainerStyle>
  )
}
const Hero = ({ name, color, rank, description, comics, index, gameState,
  selectedHero, setSelectedHero }) => {
  return (
    <Draggable key={index} draggableId={name} index={index}>
      {(provided) => {
        return (
          <HeroStyle
            review={gameState === "review"}
            color={color}
            className="menu-item tile tile-centered center-column"
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <TextStyle onClick={() => {
              setSelectedHero(name)
            }} title={description} className="tile-content">
              {name}
            </TextStyle>
            {gameState === "review" &&
              <PopupHero name={name} rank={rank} description={description}
                selectedHero={selectedHero} setSelectedHero={setSelectedHero}
              />}
          </HeroStyle>
        )
      }}
    </Draggable>
  )
}

const HeroContainerStyle = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 500px;
  margin: 20px;
  align-items: center;
  justify-content: center;
`
const HeroStyle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  align-self: center;
  min-width: 200px;
  margin-top: 20px;
  border-radius: 20px;
  background-color: ${props => (props.color )};
`

const TextStyle = styled.div`
  color: black;
`

const HeroSubContainerStyle = styled.div`
`
export default LabelsContainer
