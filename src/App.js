import React, {Component} from 'react';
import AppWrapper from './components/app-wrapper'
import './App.css';
import SwapiService from './service/swapi-service'
import {Provider} from "./service/swapi-context"

export default class App extends Component{

  apiKey= '3bc3826aac77d61a282436f0813430f4'
  state={
    genres: [],
    guest_session_id: ''
  }

  swapiService = new SwapiService()

  componentDidMount() {
    const urlGenres = `/genre/movie/list?api_key=${this.apiKey}`
    this.swapiService.getResource(urlGenres)
      .then(res=> {
        this.setState({
          genres: res.genres
        })
      })
    const urlSession = `/authentication/guest_session/new?api_key=${this.apiKey}`
    this.swapiService.getResource(urlSession)
        .then(res=> {
          this.setState({
            guestSessionId: res.guest_session_id
          })
        })
  }

  render (){
    return (
      <div className="app">
        <Provider value={this.state?.genres} >
          <AppWrapper apiKey={this.apiKey} guestSessionId={this.state?.guestSessionId}/>
        </Provider>
      </div>
    )
  }
}
