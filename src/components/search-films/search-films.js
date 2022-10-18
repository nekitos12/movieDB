import React, { Component } from 'react'
import { Alert, Spin } from 'antd'
import PropTypes from 'prop-types'
import { LoadingOutlined } from '@ant-design/icons'
import './search-films.css'
import { debounce } from 'lodash'

import FilmList from '../film-list'
import SwapiService from '../../service/swapi-service'
import FilmListPagination from '../film-list-pagination'

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24,
    }}
    spin
  />
)

export default class SearchFilms extends Component {
  basePhrase = (<Alert message="Введите ключевое слово" type="info" />)

  searchError = (<Alert message="По вашему запросу ничего не найдено" type="warning" />)

  swapiService = new SwapiService()

  state = {
    searchInput: '',
    isLoading: false,
    isAlert: this.basePhrase,
    filmData: {
      results: [],
      total_pages: 1,
    },
    currentPage: 1,
  }

  debounceFunc = debounce(this.getFilmArray, 500)

  componentDidMount() {
    this.giveRatedFilms = this.props.giveRatedFilms.bind(this)
    this.postFilmRate = this.postFilmRate.bind(this)
    this.giveRatedFilms()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.searchInput !== this.state.searchInput || prevState.currentPage !== this.state.currentPage) {
      this.debounceFunc()
    }
    this.state.ratedFilms?.forEach((film) => {
      if (prevState.ratedFilms?.find((f) => f.id === film.id)?.rating !== film.rating || !prevState.ratedFilms) {
        this.giveRatedFilms()
      }
    })
  }

  async getKeywordData() {
    try {
      if (this.state.searchInput === '') {
        return {}
      }
      const url = `/search/keyword?api_key=${this.props.apiKey}&query=${this.state.searchInput}`
      return this.swapiService.getResource(url)
    } catch (e) {
      this.setState(() => {
        return {
          filmData: {
            results: [],
          },
          isAlert: true,
        }
      })
    }
  }

  async getFilmArray() {
    try {
      const res = await this.getKeywordData()
      const url = `/keyword/${res.results[0].id}/movies?api_key=${this.props.apiKey}&page=${this.state.currentPage}`
      this.swapiService
        .getResource(url)
        .then((response) => {
          this.setState(() => {
            return {
              filmData: response,
              isAlert: null,
            }
          })
        })
        .catch(() => {
          throw new Error()
        })
      this.setLoading(false)
    } catch (e) {
      this.setLoading(false)
      this.setState(() => {
        return {
          filmData: {
            results: [],
          },
          isAlert: true,
        }
      })
    }
  }

  onInputChange = () => (e) => {
    this.setLoading()
    this.setState(() => {
      return {
        searchInput: e.target.value,
        currentPage: 1,
        alert: null,
      }
    })
  }

  setLoading = (isLoading = true) => {
    this.setState(() => {
      return {
        isLoading: Boolean(isLoading),
      }
    })
  }

  onPageChange = (num) => {
    this.setState(() => {
      return {
        currentPage: num,
      }
    })
  }

  async postFilmRate(id, rate) {
    await this.props.postFilmRate(id, rate)
    await this.giveRatedFilms()
  }

  render() {
    const { searchInput, isLoading, isAlert, filmData, ratedFilms, currentPage } = this.state
    const { apiKey, guestSessionId } = this.props

    const basePhrase = !searchInput ? this.basePhrase : null
    const emptySearch = isAlert ? this.searchError : null
    return (
      <div className="search-films app-wrapper__inner">
        <input
          type="search"
          placeholder="Type to search..."
          onChange={this.onInputChange()}
          className="search-films__input input"
          value={searchInput}
        />
        {isLoading ? (
          <div className="films__spinner">
            <Spin indicator={antIcon} />
          </div>
        ) : (
          <div className="search-films__list">
            {basePhrase || emptySearch}
            <FilmList
              filmData={filmData.results}
              postFilmRate={this.postFilmRate}
              apiKey={apiKey}
              guestSessionId={guestSessionId}
              ratedFilms={ratedFilms}
            />
            {filmData.results.length ? (
              <FilmListPagination
                onChange={this.onPageChange}
                defaultCurrent={currentPage}
                total={filmData.total_pages * 20}
              />
            ) : null}
          </div>
        )}
      </div>
    )
  }
}

SearchFilms.defaultProps = {}
SearchFilms.propTypes = {
  postFilmRate: PropTypes.func.isRequired,
  giveRatedFilms: PropTypes.func.isRequired,
}
