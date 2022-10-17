import React, {Component} from 'react';
import AppWrapper from './components/app-wrapper'
import './App.css';
import SwapiService from './service/swapi-service'
import {Provider} from "./service/swapi-context"

export default class App extends Component{

  apiKey= '3bc3826aac77d61a282436f0813430f4'

  swapiService = new SwapiService()

  componentDidMount() {
    const urlSession = `/authentication/guest_session/new?api_key=${this.apiKey}`
    this.swapiService.getResource(urlSession)
        .then(res=> {
          this.setState({
            guest_session_id: res.guest_session_id
          })
        })

    const urlGenres = `/genre/movie/list?api_key=${this.apiKey}`
    this.swapiService.getResource(urlGenres)
        .then(res=> {
            this.setState({
                genres: res.genres
            })
        })
  }

  render (){

    return (
      <div className="app">
        <Provider value={this.state?.genres} >
          <AppWrapper apiKey={this.apiKey} guest_session_id={this.state?.guest_session_id}/>
        </Provider>


      </div>
    )
  }
}
