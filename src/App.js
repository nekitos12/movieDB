import React, { Component } from 'react'

import AppWrapper from './components/app-wrapper'
import './App.css'
import SwapiService from './service/swapi-service'
import { Provider } from './service/swapi-context'
import { ServerError } from './components/my-alert'

export default class App extends Component {
  apiKey = '3bc3826aac77d61a282436f0813430f4'

  state = {
    genres: [],
    guestSessionId: '',
    isAppLoading: true,
  }

  swapiService = new SwapiService()

  componentDidMount() {
    const urlGenres = `/genre/movie/list?api_key=${this.apiKey}`
    this.swapiService
      .getResource(urlGenres)
      .then((res) => {
        this.setState({
          genres: res.genres,
        })
      })
      .catch(() => {
        this.setState(() => {
          return {
            isAppLoading: false,
            error: <ServerError />,
          }
        })
      })
    const urlSession = `/authentication/guest_session/new?api_key=${this.apiKey}`
    this.swapiService
      .getResource(urlSession)
      .then((res) => {
        this.setState({
          guestSessionId: res.guest_session_id,
          isAppLoading: false,
        })
      })
      .catch(() => {
        this.setState(() => {
          return {
            isAppLoading: false,
            error: <ServerError />,
          }
        })
      })
  }

  render() {
    const { error, genres, guestSessionId, isAppLoading } = this.state
    return (
      <div className="app">
        {error || null}
        <Provider value={genres}>
          <AppWrapper apiKey={this.apiKey} guestSessionId={guestSessionId} isAppLoading={isAppLoading} />
        </Provider>
      </div>
    )
  }
}
