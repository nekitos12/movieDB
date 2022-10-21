import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Alert, Tabs } from 'antd'

import SearchFilms from '../search-films'
import RatedFilm from '../rated-film'
import SwapiService from '../../service/swapi-service'
import MySpinner from '../my-spinner'

import './app-wrapper.css'

export default class AppWrapper extends Component {
  swapiService = new SwapiService()

  state = {
    error: null,
  }

  componentDidMount() {
    this.postFilmRate = this.postFilmRate.bind(this)
  }

  async postFilmRate(id, rate) {
    try {
      const url = `/movie/${id}/rating?api_key=${this.props.apiKey}&guest_session_id=${this.props.guestSessionId}`
      const body = {
        value: rate,
      }
      await this.swapiService.postData(url, body)
      this.setState({
        error: null,
      })
    } catch (e) {
      this.setState({
        isLoading: false,
        error: <Alert message="Ошибка в отправке рейтинга фильма" type="warning" />,
      })
    }
  }

  async giveRatedFilms() {
    try {
      const url = `/guest_session/${this.props.guestSessionId}/rated/movies?api_key=${this.props.apiKey}`
      const res = await this.swapiService.getResource(url)

      this.setState(() => {
        return {
          ratedFilms: res.results,
          isLoading: false,
          error: null,
        }
      })
    } catch (e) {
      this.setState({
        isLoading: false,
        error: <Alert message="Ошибка в получении рейтинга фильмов" type="warning" />,
      })
    }
  }

  render() {
    const { apiKey, guestSessionId, isAppLoading } = this.props
    const { error } = this.state
    return (
      <div className="app__wrapper">
        {isAppLoading ? (
          <MySpinner />
        ) : (
          <>
            {error || null}
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
          </>
        )}
      </div>
    )
  }
}

AppWrapper.defaultProps = {
  guestSessionId: '',
  isAppLoading: false,
}
AppWrapper.propTypes = {
  apiKey: PropTypes.string.isRequired,
  guestSessionId: PropTypes.string,
  isAppLoading: PropTypes.bool,
}
