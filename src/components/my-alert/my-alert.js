import React from 'react'
import { Alert } from 'antd'

import './my-alert.css'

function BasePhrase() {
  return <Alert message="Введите ключевое слово" type="info" />
}

function EmptySearch() {
  return <Alert message="По вашему запросу ничего не найдено" type="warning" />
}

function ErrorGiveRated() {
  return <Alert message="Ошибка в получении рейтинга фильмов" type="warning" />
}

function ErrorPostRate() {
  return <Alert message="Ошибка в отправке рейтинга фильма" type="warning" />
}

function ServerError() {
  return <Alert message="Ошибка в отправке рейтинга фильма" type="warning" />
}

export { BasePhrase, EmptySearch, ErrorGiveRated, ErrorPostRate, ServerError }
