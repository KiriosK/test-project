const axios = require('axios')

export const getSuggestions = data => {
  return axios({
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Token ${process.env.VUE_APP_API_KEY}`
    },
    url: 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party',
    data: data
  })
}
