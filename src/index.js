import React from 'react'
import ReactDOM from 'react-dom'
import 'spectre.css'
import './index.css'
import App from './App'
import { Auth0Provider } from '@auth0/auth0-react'
import { GraphQLProvider } from './apollo'

ReactDOM.render(
  <Auth0Provider
    domain={process.env.REACT_APP_AUTH0_DOMAIN}
    clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
    redirectUri={window.location.origin}
    audience="hasura"
  >
    <GraphQLProvider>
      <App />
    </GraphQLProvider>
  </Auth0Provider>,
  document.getElementById('root')
)
