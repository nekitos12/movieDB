import React, {Component} from 'react';
import SearchFilms from '../search-films'
import RatedFilm from '../rated-film'

import './app-wrapper.css'
import {Tabs, Spin} from "antd";



export default class AppWrapper extends Component {
  componentDidMount() {
    this.postFilmRate = this.postFilmRate.bind(this)

  }

  async postFilmRate (id, rate){
    const url = `https://api.themoviedb.org/3/movie/${id}/rating?api_key=${this.props.apiKey}&guest_session_id=${this.props.guest_session_id}`

    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        "value": rate,
      })
    })
    await this.giveRatedFilms()
  }


  async giveRatedFilms (){
    const url = `https://api.themoviedb.org/3/guest_session/${this.props.guest_session_id}/rated/movies?api_key=${this.props.apiKey}`
    const res = await fetch(url)
    const response = await res.json()
    this.setState(()=>{
      return {
        ratedFilms: response
      }
    })
  }


  render (){
    return (
      <div className="app__wrapper">

          <Tabs
            className="app__menu menu"
            defaultActiveKey="1"
            onChange={this.onTabChange}
            items={[
              {
                label: `Search`,
                key: '1',
                children:
                  <SearchFilms
                    apiKey={this.props.apiKey}
                    postFilmRate={this.postFilmRate}
                    guest_session_id={this.props.guest_session_id}
                    ratedFilms={this.state?.ratedFilms}
                    giveRatedFilms={this.giveRatedFilms}
                  />,
              },
              {
                label: `Rated`,
                key: '2',
                children:
                  <RatedFilm
                    apiKey={this.props.apiKey}
                    postFilmRate={this.postFilmRate}
                    guest_session_id={this.props.guest_session_id}
                    ratedFilms={this.state?.ratedFilms}
                    giveRatedFilms={this.giveRatedFilms}
                  />,
              },
            ]}
          />


      </div>

    )
  }

}
