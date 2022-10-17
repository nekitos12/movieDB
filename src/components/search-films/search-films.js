import React, {Component} from 'react';
import FilmList from '../film-list'
import {Alert, Pagination, Spin} from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import './search-films.css'
import {debounce} from "lodash";
import SwapiService from "../../service/swapi-service";

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24,
    }}
    spin
  />
);


export default class SearchFilms extends Component {
  basePhrase = <Alert message="Введите ключевое слово" type="info" />
  searchError = <Alert message="По вашему запросу ничего не найдено" type="warning"/>
  swapiService = new SwapiService()

  state ={
    searchInput:'',
    loading:false,
    alert: this.basePhrase,
    filmData: {
      results: [],
      total_pages: 1
    },
    currentPage:1,
    rate:[],
  }

  debounceFunc = debounce(this.getFilmArray,500)

  componentDidUpdate(prevProps, prevState, snapshot) {

    if (prevState.searchInput!== this.state.searchInput ||prevState.currentPage!==this.state.currentPage) {
      this.debounceFunc()
      // this.props.giveRatedFilms()
    }
  }



  async getKeywordData (){
    try {
      if (this.state.searchInput===''){
        return {}
      }
      const url = `/search/keyword?api_key=${this.props.apiKey}&query=${this.state.searchInput}`
      return this.swapiService.getResource(url)
    }
    catch (e){
      this.setState(()=>{
        return {
          filmData: {
            results:[]
          },
          alert: true,
        }
      })
    }


  }

  async getFilmArray (){
    try {
      const res = await this.getKeywordData()
      const url = `/keyword/${res.results[0].id}/movies?api_key=${this.props.apiKey}&page=${this.state.currentPage}`
      this.swapiService.getResource(url)
        .then(res=>{
          this.setState(() => {
            return {
              filmData: res,
              alert: null,
            }
          })
        })
        .catch(rej=>{
          throw new Error
        }
        )
      this.setLoading(false)

    }
    catch (e){
      console.log(e)
      this.setLoading(false)
      this.setState(()=>{
        return {
          filmData: {
            results:[]
          },
          alert: true,
        }
      })
    }
  }




  onInputChange =()=>(e)=>{
    this.setLoading()
    this.setState(()=>{
      return {
        searchInput: e.target.value,
        currentPage: 1,
        alert: null
      }
    })
  }

  setLoading =(isLoading = true)=>{
    this.setState(()=>{
      return{
        isLoading: Boolean(isLoading),
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

  render (){
    const basePhrase = !this.state.searchInput ? this.basePhrase:null
    const emptySearch = this.state.alert? this.searchError:null
    return (
      <div className="search-films app-wrapper__inner">
        <input
          type="search"
          placeholder="Type to search..."
          onChange={this.onInputChange()}
          className="search-films__input input"
          value={this.state.searchInput}
        />
        {this.state.isLoading
          ?
          <div className="films__spinner">
            <Spin indicator={antIcon}/>
          </div>
          :
          <div className="search-films__list">
            {basePhrase || emptySearch}
            <FilmList
              filmData ={this.state.filmData.results}
              postFilmRate={this.props.postFilmRate}
              apiKey={this.props.apiKey}
              guest_session_id={this.props.guest_session_id}
              ratedFilms={this.props.ratedFilms?.results}
            />
            {this.state.filmData.results.length?<Pagination onChange={this.onPageChange} defaultPageSize ={20} defaultCurrent={this.state.currentPage} total={this.state.filmData.total_pages*20}/>:null}
          </div>
        }
        {/*{elements?<Pagination onChange={onPageChange} defaultPageSize ={20} defaultCurrent={startPage || currentPage} total={totalPages*20}/>:null}*/}
      </div>
    )
  }
}
