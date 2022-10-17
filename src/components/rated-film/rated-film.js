import React, {Component} from 'react';

import './rated-film.css'
import {Alert, Pagination, Spin} from "antd";
import FilmList from "../film-list";



export default class RatedFilm extends Component {
  state ={
    currentPage: 1
  }

  onPageChange=(num)=>{
    this.setState(()=>{
      return {
        currentPage: num
      }
    })
  }

  render (){
    console.log(this.props)
    return (
      <div className="rated-films app-wrapper__inner">
        <div className="rated-films__list">
          <FilmList
            filmData ={this.props.ratedFilms?.results || []}
            postFilmRate={this.props.postFilmRate}
            apiKey={this.props.apiKey}
            guest_session_id={this.props.guest_session_id}
            ratedFilms={this.props.ratedFilms?.results}
          />
          {this.props.ratedFilms?.results.length?<Pagination onChange={this.onPageChange} defaultPageSize ={20} defaultCurrent={this.state.currentPage} total={this.props.ratedFilms?.results.length}/>:null}
        </div>
      </div>
    )
  }
}
