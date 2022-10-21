export default class SwapiService {
  _apiBase = 'https://api.themoviedb.org/3'

  async getResource(url) {
    const res = await fetch(`${this._apiBase}${url}`)

    if (!res.ok) {
      throw new Error('ошибка в получении данных')
    }

    return await res.json()
  }

  async postData(url, body) {
    const res = await fetch(`${this._apiBase}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      throw new Error('ошибка в получении данных')
    }
  }

  async getPoster(poster) {
    const url = `https://image.tmdb.org/t/p/w185${poster}`
    const res = await fetch(url)
    return await res.blob()
  }
}
