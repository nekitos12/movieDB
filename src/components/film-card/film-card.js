import { Card, Rate, Tag } from 'antd'
import React from 'react'
import './film-card.css'
import format from 'date-fns/format'
import PropTypes from 'prop-types'

import SwapiService from '../../service/swapi-service'

const classNames = require('classnames')

export default class FilmCard extends React.Component {
  swapiService = new SwapiService()

  state = {
    poster: null,
  }

  async componentDidMount() {
    if (!this.props.film.poster_path) {
      this.setState({
        // eslint-disable-next-line global-require
        poster: require('../../img/заглушка.jpg'),
      })
      return
    }
    this.getPoster = this.getPoster.bind(this)
    await this.getPoster()
  }

  componentWillUnmount() {
    clearTimeout(this.interval)
  }

  async getPoster() {
    try {
      const res = await this.swapiService.getPoster(this.props.film.poster_path)
      this.setState({
        poster: URL.createObjectURL(res),
      })
    } catch (e) {
      this.interval = setTimeout(this.getPoster, 1000)
    }
  }

  getCutText = (text, maxLength = 150) => {
    const spaceBeforeCut = text.indexOf(' ', maxLength)
    return spaceBeforeCut > 0 ? `${text.slice(0, spaceBeforeCut)}...` : text
  }

  render() {
    const { original_title, overview, release_date, id, genre_ids } = this.props.film
    const { rate, genres, postFilmRate } = this.props
    const overviewText = this.getCutText(overview)
    const titleText = this.getCutText(original_title, 25)
    const colorRate = rate
      ? classNames({
          'low-rating': rate >= 0 && rate < 3,
          'middle-rating': rate >= 3 && rate < 5,
          'high-rating': rate >= 5 && rate < 7,
          'top-rating': rate >= 7,
        })
      : null
    const filmCreatedAt = format(new Date(release_date), 'LLLL d, y')
    const genreData = genres.map((genreApi) =>
      genre_ids.some((idGenre) => idGenre === genreApi.id) ? (
        <Tag className=" " key={genreApi.name}>
          {genreApi.name}
        </Tag>
      ) : null
    )
    return (
      <div className="film-card films-list__card">
        <Card>
          <img aria-label="постер фильма" className="film-card__poster" src={this.state.poster} />
          <div className="film-card__circle-rate circle-rate">
            <span className="circle-rate__rate">{rate || ''}</span>
            <svg height="30" width="30" className="circle-rate__circle">
              <circle r="14" className={colorRate} cx="15" cy="15" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <div className="film-card__descr">
            <h2 className="film-card__title">{titleText}</h2>
            <div className="film-card__date">{filmCreatedAt}</div>
            <div className="film-card__genres">{genreData}</div>

            <div className="film-card__overview">{overviewText}</div>
            <Rate
              allowHalf
              count={10}
              className="film-card__rate"
              defaultValue={rate}
              onChange={(value) => postFilmRate(id, value)}
            />
          </div>
        </Card>
      </div>
    )
  }
}

FilmCard.defaultProps = {}
FilmCard.propTypes = {
  rate: PropTypes.number.isRequired,
  genres: PropTypes.array.isRequired,
}
