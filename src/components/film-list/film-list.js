import React, {Component} from 'react';
import FilmCard from '../film-card'

import './film-list.css'
import {Consumer} from "./../../service/swapi-context"

export default class FilmList extends Component {

  render (){
      const {filmData, ratedFilms} = this.props
      const elements = filmData.length? filmData.map(film => {
        return (
          <li key={film.id} className="films-list__item">
            <Consumer>
              {
                (genres)=>{
                  console.log(genres)
                  return (
                    <FilmCard
                      film={film}
                      rate={ratedFilms?.some(f=>f.id===film.id)? ratedFilms.find(f=>f.id===film.id).rating:0}
                      postFilmRate={this.props.postFilmRate}
                      apiKey={this.props.apiKey}
                      guest_session_id={this.props.guest_session_id}
                      genres={[...genres] ||[]}
                    />
                  )

                }
              }
            </Consumer>

          </li>
        )
      }) :null

        return (
          <ul className="films-list">
            {elements}
          </ul>

        )
    }
}
