import {Card, Rate, Tag} from "antd";
import React from "react";
import './film-card.css'
import SwapiService from "../../service/swapi-service";

export default class FilmCard extends React.Component{
    swapiService = new SwapiService()

    getCutText = (text, maxLength = 150)=>{
        const spaceBeforeCut = text.indexOf(' ', maxLength)
        return spaceBeforeCut > 0 ? text.slice(0, spaceBeforeCut) + '...' : text
    }

    async giveRateOfFilm (id){
        const url = `/guest_session/${this.props.guest_session_id}/rated/movies?api_key=${this.props.apiKey}`
        this.swapiService.getResource(url)
          .then(res=> {
              const ratedFilm = res.results.find(elem=> elem.id === id)
              this.setState(()=>{
                  return {
                      rate: ratedFilm?.rating || ''
                  }
              })
          })

    }

    async postRate (id, rate){
        await this.props.postFilmRate(id, rate)
        await this.giveRateOfFilm(id)
    }

    render (){
        const { original_title, overview, poster_path, release_date, id, genre_ids} = this.props.film
        console.log(genre_ids)
        console.log(this.props.genres)
        const withoutPoster = `${require('./../../img/заглушка.jpg')}`
        const overviewText = this.getCutText(overview)
        const titleText = this.getCutText(original_title, 25)

        const genreData = this.props.genres.map(genreApi => genre_ids.some(id=> id === genreApi.id) ? <Tag className=" " >{genreApi.name}</Tag>:null)
        console.log(genreData)


        console.log('ошибки нет3    ')
        return (

            <div className="film-card films-list__card">

                <img className="film-card__poster" src={poster_path ?`https://image.tmdb.org/t/p/w185/${poster_path}`: withoutPoster}/>

                <Card className="film-card__descr">
                    <p className="film-card__title">{titleText}</p>
                    <p className="film-card__date">{release_date}</p>
                    {genreData}
                    <p className="film-card__overview">{overviewText}</p>
                    <Rate count={10} className="film-card__rate" defaultValue={ this.props.rate || ''} onChange={(value)=>this.postRate(id, value)}/>
                    <div className="film-card__circle-rate circle-rate">
                        <span className="circle-rate__rate">{this.props.rate || ''}</span>
                        <svg height="30" width="30" className="circle-rate__circle">
                            <circle  r="14" stroke="black" cx="15" cy="15" strokeWidth="2" fill="none" />
                        </svg>

                    </div>

                </Card>


            </div>

        )
    }

}

