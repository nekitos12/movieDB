import React, {Component} from 'react';

import './rated-film.css'
import FilmList from "../film-list";
import FilmListPagination from "./../film-list-pagination"
import PropTypes from "prop-types";



export default class RatedFilm extends Component {
  state ={
    currentPage: 1
  }
  componentDidMount() {
    this.giveRatedFilms = this.props.giveRatedFilms.bind(this)
    this.postFilmRate = this.postFilmRate.bind(this)
    this.giveRatedFilms()
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    this.state.ratedFilms?.forEach(film=>{
      if (prevState.ratedFilms?.find(f=> f.id===film.id)?.rating!==film.rating || !prevState.ratedFilms){
        this.giveRatedFilms()
      }
    })
  }

  onPageChange=(num)=>{
    this.setState(()=>{
      return {
        currentPage: num
      }
    })
  }

  async postFilmRate (id, rate){
    await this.props.postFilmRate(id,rate)
    await this.giveRatedFilms()
  }

  render (){
    const {  ratedFilms, currentPage} =this.state
    const {apiKey, guestSessionId} = this.props
    return (
      <div className="rated-films app-wrapper__inner">
        <div className="rated-films__list">
          <FilmList
            filmData ={ratedFilms || []}
            postFilmRate={this.postFilmRate}
            apiKey={apiKey}
            guestSessionId={guestSessionId}
            ratedFilms={ratedFilms}
          />
          {ratedFilms?.length
            ?
            <FilmListPagination
              onChange={this.onPageChange}
              defaultCurrent={currentPage}
              total={ratedFilms.length}
            />:null}
        </div>
      </div>
    )
  }
}

RatedFilm.defaultProps = {
  todos: [],
}
RatedFilm.propTypes = {
  postFilmRate: PropTypes.func.isRequired,
  giveRatedFilms: PropTypes.func.isRequired,
}
