export default class SwapiService {


  _apiBase ='https://api.themoviedb.org/3'

  async getResource (url) {
    const res = await fetch(`${this._apiBase}${url}`)

    if (!res.ok){
      throw new Error
    }

    return await res.json()
  }





}