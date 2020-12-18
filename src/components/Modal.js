import React, { useEffect, useState } from 'react'
import gql from 'graphql-tag'
import { GAME_STATE, getScore, getTimeBonus, getTotalScore } from '../custom/utils'
import { useMutation } from '@apollo/client'
import { useAuth0 } from '@auth0/auth0-react'

const INSERT_FOB_GAME = gql`
  mutation InsertFobGame($points: numeric!, $email: String!) {
    insert_fob_game(objects: { points: $points, email: $email }) {
      returning {
        id
      }
    }
  }
`

const Modal = ({ gameState, groups, startGame, timeLeft, resetGame }) => {
  const [insertFobGame] = useMutation(INSERT_FOB_GAME)
  const { isAuthenticated, user, loginWithRedirect } = useAuth0()

  const [totalScore, setTotalScore] = useState(0)
  const [timeBonus, setTimeBonus] = useState(0)
  const [score, setScore] = useState(0)
  useEffect(() => {
    const doInsertFobGame = async (groups, timeLeft) => {
      try {
        await insertFobGame({
          variables: {
            points: getTotalScore(groups, timeLeft),
            email: user.email,
          },
        })
      } catch (e) {
        console.log('error', e)
      }
    }
    if (isAuthenticated && gameState !== GAME_STATE.READY && user) {
      doInsertFobGame(groups, timeLeft)
    }
  }, [gameState, isAuthenticated, user])

  useEffect(() => {
    setTotalScore(getTotalScore(groups, timeLeft))
    setTimeBonus(getTimeBonus(timeLeft))
    setScore(getScore(groups))
  }, [groups, timeLeft])

  return (
    <div className="modal modal-sm active">
      <div className="modal-overlay" />
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-title h4">Fiskaflokkingarspæl</div>
        </div>
        <div className="modal-body">
          <div className="content h6">
            {' '}
            {gameState === GAME_STATE.READY
              ? `Hála og slepp ymsu fiskarnar í báðar bólkarnar.`
              : `Tú fekk: ${totalScore} stig, har ið tíðsbonusið taldi ${totalScore > 0 ? timeBonus : 0} stig. Tú fekst ${score} fyri at seta fiskarnar í tilhoyrandi kassar og í røttu raðfylgju.`}
          </div>
        </div>
        <div className="modal-footer">
          {!isAuthenticated && gameState === GAME_STATE.READY && (
            <button
              className="btn btn-default"
              onClick={loginWithRedirect}
              style={{ marginRight: '20px' }}
            >
              Logga inn
            </button>
          )}
          <button
            className="btn btn-primary"
            onClick={gameState === GAME_STATE.READY ? startGame : resetGame}
          >
            {gameState === GAME_STATE.READY
              ? 'Byrja spælið'
              : 'Spæl av nýggjum'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal
