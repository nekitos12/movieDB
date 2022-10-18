import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './film-list.css'
import { Consumer } from '../../service/swapi-context'
import FilmCard from '../film-card'

export default class FilmList extends Component {
  render() {
    const { filmData, ratedFilms, postFilmRate, apiKey, guestSessionId } = this.props
    const elements = filmData.length
      ? filmData.map((film) => {
          return (
            <li key={film.id} className="films-list__item">
              <Consumer>
                {(genres) => {
                  return (
                    <FilmCard
                      film={film}
                      rate={
                        ratedFilms?.some((f) => f.id === film.id) ? ratedFilms.find((f) => f.id === film.id).rating : 0
                      }
                      postFilmRate={postFilmRate}
                      apiKey={apiKey}
                      guestSessionId={guestSessionId}
                      genres={[...genres] || []}
                    />
                  )
                }}
              </Consumer>
            </li>
          )
        })
      : null

    return <ul className="films-list">{elements}</ul>
  }
}

FilmList.defaultProps = {
  ratedFilms: [],
  filmData: [],
}
FilmList.propTypes = {
  postFilmRate: PropTypes.func.isRequired,
  ratedFilms: PropTypes.array,
  filmData: PropTypes.array,
}
