import React, { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import gql from 'graphql-tag'
import { useSubscription } from '@apollo/client'

const GET_SCORES = gql`
  subscription GetScores($email: String!) {
    fob_game(
      where: { email: { _eq: $email } }
      order_by: { updated_at: desc }
    ) {
      updated_at
      points
    }
  }
`

const HighScore = () => {
  const { isAuthenticated, user } = useAuth0()
  const [email, setEmail] = useState('')
  useEffect(() => {
    if (user) {
      setEmail(user.email)
    }
  }, [user])

  const { data: scores } = useSubscription(GET_SCORES, {
    variables: {
      email: email,
    },
  })

  if (isAuthenticated) {
    return (
      <div style={{padding: '20px'}}>
        <h3>Higartil hevur tú fingið:</h3>
        {scores &&
          scores.fob_game.map((score, index) => {
            const timestamp = new Date(score.updated_at.replace(' ', 'T'))
            return (
              <div key={index}>
                {score.points} stig ({timestamp.toLocaleTimeString()})
              </div>
            )
          })}
      </div>
    )
  } else return false
}

export default HighScore
