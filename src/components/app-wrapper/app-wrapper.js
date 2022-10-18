import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tabs } from 'antd'

import SearchFilms from '../search-films'
import RatedFilm from '../rated-film'

import './app-wrapper.css'

export default class AppWrapper extends Component {
  componentDidMount() {
    this.postFilmRate = this.postFilmRate.bind(this)
  }

  async postFilmRate(id, rate) {
    const url = `https://api.themoviedb.org/3/movie/${id}/rating?api_key=${this.props.apiKey}&guest_session_id=${this.props.guestSessionId}`
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        value: rate,
      }),
    })
  }

  async giveRatedFilms() {
    const url = `https://api.themoviedb.org/3/guest_session/${this.props.guestSessionId}/rated/movies?api_key=${this.props.apiKey}`
    const res = await fetch(url)
    const response = await res.json()
    this.setState(() => {
      return {
        ratedFilms: response.results,
      }
    })
  }

  render() {
    const { apiKey, guestSessionId } = this.props
    return (
      <div className="app__wrapper">
        <Tabs
          className="app__menu menu"
          defaultActiveKey="1"
          destroyInactiveTabPane
          onChange={this.onTabChange}
          items={[
            {
              label: 'Search',
              key: '1',
              children: (
                <SearchFilms
                  apiKey={apiKey}
                  postFilmRate={this.postFilmRate}
                  guestSessionId={guestSessionId}
                  giveRatedFilms={this.giveRatedFilms}
                />
              ),
            },
            {
              label: 'Rated',
              key: '2',
              children: (
                <RatedFilm
                  apiKey={apiKey}
                  postFilmRate={this.postFilmRate}
                  guestSessionId={guestSessionId}
                  giveRatedFilms={this.giveRatedFilms}
                />
              ),
            },
          ]}
        />
      </div>
    )
  }
}

AppWrapper.defaultProps = {
  guestSessionId: '',
}
AppWrapper.propTypes = {
  apiKey: PropTypes.string.isRequired,
  guestSessionId: PropTypes.string,
}
