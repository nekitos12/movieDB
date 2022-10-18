import { Card, Rate, Tag } from 'antd'
import React from 'react'
import './film-card.css'
import format from 'date-fns/format'
import PropTypes from 'prop-types'

const classNames = require('classnames')

export default class FilmCard extends React.Component {
  getCutText = (text, maxLength = 150) => {
    const spaceBeforeCut = text.indexOf(' ', maxLength)
    return spaceBeforeCut > 0 ? `${text.slice(0, spaceBeforeCut)}...` : text
  }

  async postRate(id, rate) {
    await this.props.postFilmRate(id, rate)
  }

  render() {
    const { original_title, overview, poster_path, release_date, id, genre_ids } = this.props.film
    const { rate, genres } = this.props

    // eslint-disable-next-line global-require
    const withoutPoster = `${require('../../img/заглушка.jpg')}`
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
          <img
            alt="постер фильма"
            className="film-card__poster"
            src={poster_path ? `https://image.tmdb.org/t/p/w185/${poster_path}` : withoutPoster}
          />
          <div className="film-card__circle-rate circle-rate">
            <span className="circle-rate__rate">{rate || ''}</span>
            <svg height="30" width="30" className="circle-rate__circle">
              <circle r="14" className={colorRate} cx="15" cy="15" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <div className="film-card__descr">
            <p className="film-card__title">{titleText}</p>
            <p className="film-card__date">{filmCreatedAt}</p>
            <div className="film-card__genres">{genreData}</div>

            <p className="film-card__overview">{overviewText}</p>
            <Rate
              allowHalf
              count={10}
              className="film-card__rate"
              defaultValue={rate}
              onChange={(value) => this.postRate(id, value)}
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
